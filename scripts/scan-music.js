/**
 * Scan music directory and add to Mongo database
 */

const path = require('path');
const fs = require('fs');
const musicmetadata = require('music-metadata');
const ProgressBar = require('progress');

const config = require('../common/config');
const getLogger = require('../common/logger');
const Database = require('../common/db');

const hasArg = arg => process.argv.indexOf(`-${arg.substring(0, 1)}`) !== -1 ||
    process.argv.indexOf(`--${arg}`) !== -1;

const DRY_RUN = hasArg('dry-run');

async function getDirectoriesFromDirList(logger, directory, items, pattern) {
    const itemsWithDirInfo = await Promise.all(items.map(item => {
        const filename = path.join(directory, item);

        return new Promise(resolve => {
            fs.stat(filename, (fileErr, stats) => {
                if (fileErr) {
                    logger.error('Error reading file:', filename);

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

function getFilesList(logger, directory, pattern = null, counted = [], level = 0) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, async (err, items) => {
            if (err) {
                if (level === 0) {
                    logger.error('Error reading top-level directory:', directory);

                    return reject(err);
                }

                logger.error('Error reading directory:', directory);

                return resolve(counted);
            }

            const { files, directories } = await getDirectoriesFromDirList(logger, directory, items, pattern);

            // run this function recursively to get all the files
            const directoryResults = await Promise.all(directories.map(
                subDir => getFilesList(logger, subDir, pattern, counted, level + 1)
            ));

            const filesFromSubDirs = directoryResults.reduce(
                (list, listItems) => list.concat(listItems), []
            );

            return resolve(files.concat(filesFromSubDirs));
        });
    });
}

function getListOfMusicFiles(logger, directory) {
    logger.info('Scanning music directory...');

    return getFilesList(logger, directory, config.scripts.scanMusic.filesPattern);
}

function getMusicFilesInDatabase(logger, db) {
    logger.verbose('Getting existing list from database...');

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
            // eslint-disable-next-line no-await-in-loop
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

function deleteFromDatabase(logger, db, files) {
    logger.info('Deleting items from the database which have been removed...');

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

async function initScan(logger, files, db) {
    if (!files.length) {
        return;
    }

    logger.verbose('Scanning and adding tag info for new files...');
    const progress = getProgressBar(files.length);

    const { scanErrors, dbErrors, numInserted } = await scanAndAddMusic(db, files, progress);

    if (scanErrors.length) {
        logger.warn(scanErrors.length, 'file(s) could not be scanned');
        logger.debug('They were:', scanErrors);
    }

    if (dbErrors.length) {
        logger.error(`${dbErrors.length} row(s) could not be inserted`);
        logger.debug('They were:', dbErrors);
    }

    logger.debug(`${numInserted} item(s) inserted`);
}

async function scanMusic(directory) {
    let status = 0;
    let db = null;

    const logger = getLogger();

    if (DRY_RUN) {
        logger.warn('Not changing anything; this is a dry run');
    }

    try {
        logger.verbose('Connecting to database...');
        db = await Database.dbConnect(config.dbUri);

        const filesList = await getListOfMusicFiles(logger, directory);
        logger.verbose(`Finished initial scan of music directory (found ${filesList.length} item(s))`);

        const dbList = await getMusicFilesInDatabase(logger, db);
        logger.debug(`${dbList.length} item(s) in database`);

        const filesNotInDb = getFilesNotInDb(filesList, dbList);
        logger.debug(`${filesNotInDb.length} file(s) to be scanned`);

        await initScan(logger, filesNotInDb, db);

        const deletedMusic = getDeletedMusic(filesList, dbList);
        await deleteFromDatabase(logger, db, deletedMusic);
        logger.debug(`${deletedMusic.length} item(s) deleted`);
    }
    catch (err) {
        logger.error('An error occurred:', err.message);
        logger.debug(err.stack);

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

