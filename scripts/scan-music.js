/**
 * Scan music directory and add to Mongo database
 */

/* eslint-disable max-statements */

const path = require('path');
const fs = require('fs');
const musicmetadata = require('music-metadata');
const Dotenv = require('dotenv');
Dotenv.config();
const ProgressBar = require('progress');

const config = require('../common/config');
const logger = require('../common/logger');
const Database = require('../common/db');

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

function scanMusicInfo(filesList, progress) {
    return Promise.all(filesList.map(file => scanMusicInfoSingle(file, progress)));
}

function insertNewRows(db, rows) {
    if (!rows.length) {
        return null;
    }

    return new Promise((resolve, reject) => db
        .collection(config.collections.music)
        .insert(rows, err => {
            if (err) {
                return reject(err);
            }

            return resolve();
        })
    );
}

function deleteFromDatabase(db, files) {
    if (!files.length) {
        return null;
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

async function scanMusic(directory) {
    let db = null;

    try {
        logger('MSG', 'Connecting to database...');
        db = await Database.dbConnect(config.dbUri);

        logger('MSG', 'Scanning music directory...');
        const filesList = await getListOfMusicFiles(directory);
        logger('DEBUG', `Found ${filesList.length} file(s)`);

        logger('MSG', 'Getting existing list from database...');
        const dbList = await getMusicFilesInDatabase(db);
        logger('DEBUG', `${dbList.length} item(s) in database`);

        logger('MSG', 'Filtering: checking which files need to be added to the database...');
        const filesNotInDb = getFilesNotInDb(filesList, dbList);
        logger('DEBUG', `${filesNotInDb.length} file(s) to be scanned`);

        if (filesNotInDb.length > 0) {
            logger('MSG', 'Scanning and adding tag info for new files...');
            const progressReadFiles = getProgressBar(filesNotInDb.length);
            const rows = await scanMusicInfo(filesNotInDb, progressReadFiles);
            await insertNewRows(db, rows);
            logger('DEBUG', `${filesNotInDb.length} item(s) inserted`);
        }

        logger('MSG', 'Deleting items from the database which have been removed...');
        const deletedMusic = getDeletedMusic(filesList, dbList);
        await deleteFromDatabase(db, deletedMusic);
        logger('DEBUG', `${deletedMusic.length} item(s) deleted`);
    }
    catch (err) {
        logger('FATAL', 'An error occurred:', err);
    }
    finally {
        if (db) {
            db.close();
        }
    }
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

