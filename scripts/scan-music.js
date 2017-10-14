/**
 * Scan music directory and add to Mongo database
 */

/* eslint-disable max-statements, no-await-in-loop */

const path = require('path');
const fs = require('fs');
const musicmetadata = require('music-metadata');
const Dotenv = require('dotenv');
Dotenv.config();
const ProgressBar = require('progress');

const config = require('../common/config');
const logger = require('../common/logger');
const Database = require('../common/db');

const hasArg = arg => process.argv.indexOf(`-${arg.substring(0, 1)}`) !== -1 ||
    process.argv.indexOf(`--${arg}`) !== -1;

const DRY_RUN = hasArg('dry-run');
const VERBOSE = hasArg('verbose');
const QUIET = hasArg('quiet');

async function getDirectoriesFromDirList(directory, items, pattern) {
    const itemsWithDirInfo = await Promise.all(items.map(item => {
        const filename = path.join(directory, item);

        return new Promise(resolve => {
            fs.stat(filename, (fileErr, stats) => {
                if (fileErr) {
                    logger('ERROR', 'Error reading file:', filename);

                    return resolve(null);
                }

                const isDir = stats.isDirectory();

                if (pattern && !isDir && !filename.match(pattern)) {
                    return resolve(null);
                }

                return resolve({ filename, isDir });
            });
        });
    }));

    return itemsWithDirInfo
        .filter(item => item !== null)
        .reduce((result, item) => {
            if (item.isDir) {
                result.directories.push(item.filename);
            }
            else {
                result.files.push(item.filename);
            }

            return result;
        }, { files: [], directories: [] });
}

function getFilesList(directory, pattern = null, counted = [], level = 0) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, async (err, items) => {
            if (err) {
                if (level === 0) {
                    logger('FATAL', 'Error reading top-level directory:', directory);

                    return reject(err);
                }

                logger('ERROR', 'Error reading directory:', directory);

                return resolve(counted);
            }

            const { files, directories } = await getDirectoriesFromDirList(directory, items, pattern);

            // run this function recursively to get all the files
            const directoryResults = await Promise.all(directories.map(
                subDir => getFilesList(subDir, pattern, counted, level + 1)
            ));

            const filesFromSubDirs = directoryResults.reduce(
                (list, listItems) => list.concat(listItems), []
            );

            return resolve(files.concat(filesFromSubDirs));
        });
    });
}

function getListOfMusicFiles(directory) {
    return getFilesList(directory, config.scripts.scanMusic.filesPattern);
}

function getMusicFilesInDatabase(db) {
    const music = db.collection(config.collections.music);

    return new Promise((resolve, reject) => {
        music
            .find({}, { file: 1 })
            .toArray((err, docs) => {
                if (err) {
                    return reject(err);
                }

                const files = docs.map(doc => doc.file);

                return resolve(files);
            });
    });
}

function arrayComplement(array1, array2) {
    return array1.filter(item => array2.indexOf(item) === -1);
}

function getFilesNotInDb(filesList, dbList) {
    return arrayComplement(filesList, dbList);
}

function getDeletedMusic(filesList, dbList) {
    return arrayComplement(dbList, filesList);
}

async function scanMusicInfoSingle(file, progress = null) {
    const metadata = await musicmetadata.parseFile(file, {
        skipCovers: true
    });

    const { title, artist, album, year } = metadata.common;
    const { bitrate, duration, sampleRate } = metadata.format;

    const track = metadata.common.track.no || 0;

    const info = {
        track,
        title,
        artist,
        album,
        year,
        bitrate,
        duration,
        sampleRate
    };

    if (progress) {
        progress.tick();
    }

    return { file, info };
}

function insertNewRow(db, row) {
    if (!row) {
        throw new Error('null row');
    }

    return new Promise((resolve, reject) => db
        .collection(config.collections.music)
        .insertOne(row, err => {
            if (err) {
                return reject(err);
            }

            return resolve();
        })
    );
}

async function scanAndAddMusic(db, filesList, progress) {
    const scanErrors = [];
    const dbErrors = [];
    let numInserted = 0;

    for (const file of filesList) {
        try {
            const row = await scanMusicInfoSingle(file, progress);

            if (DRY_RUN) {
                numInserted += 1;
            }
            else {
                try {
                    insertNewRow(db, row);

                    numInserted += 1;
                }
                catch (dbErr) {
                    dbErrors.push(file);
                }
            }
        }
        catch (err) {
            scanErrors.push(file);
        }
    }

    return { scanErrors, dbErrors, numInserted };
}

function deleteFromDatabase(db, files) {
    if (!files.length) {
        return null;
    }

    if (DRY_RUN) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => db
        .collection(config.collections.music)
        .remove({ $or: files.map(file => ({ file })) }, err => {
            if (err) {
                return reject(err);
            }

            return resolve();
        })
    );
}

function getProgressBar(total) {
    return new ProgressBar('[:bar] :percent :etas', {
        total,
        complete: '=',
        incomplete: ' ',
        width: 50
    });
}

async function initScan(files, db) {
    if (!files.length) {
        return;
    }

    let progress = null;

    if (!QUIET) {
        logger('MSG', 'Scanning and adding tag info for new files...');
        progress = getProgressBar(files.length);
    }

    const { scanErrors, dbErrors, numInserted } = await scanAndAddMusic(db, files, progress);

    if (!QUIET) {
        if (scanErrors.length) {
            logger('ERROR', scanErrors.length, 'file(s) could not be scanned');
            if (VERBOSE) {
                logger('DEBUG', 'They were:', scanErrors);
            }
        }

        if (dbErrors.length) {
            logger('ERROR', dbErrors.length, 'row(s) could not be inserted');
            if (VERBOSE) {
                logger('DEBUG', 'They were:', dbErrors);
            }
        }
    }

    if (VERBOSE) {
        logger('DEBUG', `${numInserted} item(s) inserted`);
    }
}

async function scanMusic(directory) {
    let status = 0;
    let db = null;

    if (DRY_RUN) {
        logger('WARN', 'Not changing anything; this is a dry run');
    }

    try {
        logger('MSG', 'Connecting to database...');
        db = await Database.dbConnect(config.dbUri);

        logger('MSG', 'Scanning music directory...');
        const filesList = await getListOfMusicFiles(directory);
        if (VERBOSE) {
            logger('DEBUG', `Finished initial scan of music directory (found ${filesList.length} item(s))`);
        }

        logger('MSG', 'Getting existing list from database...');
        const dbList = await getMusicFilesInDatabase(db);
        logger('DEBUG', `${dbList.length} item(s) in database`);

        if (!QUIET) {
            logger('MSG', 'Filtering: checking which files need to be added to the database...');
        }
        const filesNotInDb = getFilesNotInDb(filesList, dbList);
        if (VERBOSE) {
            logger('DEBUG', `${filesNotInDb.length} file(s) to be scanned`);
        }

        await initScan(filesNotInDb, db);

        logger('MSG', 'Deleting items from the database which have been removed...');
        const deletedMusic = getDeletedMusic(filesList, dbList);
        await deleteFromDatabase(db, deletedMusic);
        logger('DEBUG', `${deletedMusic.length} item(s) deleted`);
    }
    catch (err) {
        logger('FATAL', 'An error occurred:', err);
        if (VERBOSE) {
            logger('FATAL', err.stack);
        }

        status = 1;
    }
    finally {
        if (db) {
            db.close();
        }
    }

    return status;
}

function init() {
    scanMusic(config.scripts.scanMusic.musicDirectory);
}

if (require.main === module) {
    init();
}

module.exports = {
    getFilesList,
    getListOfMusicFiles,
    getMusicFilesInDatabase,
    scanMusicInfoSingle,
    scanMusic
};

