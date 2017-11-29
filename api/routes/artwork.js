import path from 'path';
import fs from 'fs';
import request from 'request';
import { call } from '../helpers/effects';
import { Client as DiscogsClient } from 'disconnect';

import config from '../../common/config';

export const ARTWORK_PATH = path.join(__dirname, '../../.artwork');
export const ARTWORK_UNKNOWN_FILE = `${ARTWORK_PATH}/unknown-artwork.png`;

import { getContentTypeFromFile, getBufferFromFile } from '../../common/buffer-from-file';

export function encodeArtistAlbum(artist, album) {
    return Buffer.from(`${artist}/${album}`).toString('base64');
}

export function decodeArtistAlbum(encoded) {
    const decoded = String(Buffer.from(encoded, 'base64'));

    const match = decoded.match(/^(.+?)\/(.*)$/);

    const artist = decodeURIComponent(match[1]);
    const album = decodeURIComponent(match[2]) || '';

    if (!artist.length) {
        throw new Error('Must supply artist');
    }

    return { artist, album };
}

export function getExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');

    if (lastDotIndex === -1) {
        return '';
    }

    return filename.substring(lastDotIndex + 1);
}

export function *downloadArtwork(url, artist, album) {
    const dest = `${ARTWORK_PATH}/${encodeArtistAlbum(artist, album)}.${getExtension(url)}`;

    const req = request.defaults({
        jar: true,
        rejectUnauthorized: false,
        followAllRedirects: true
    });

    const file = yield call(fs.createWriteStream, dest);

    const result = yield call(req.get, {
        url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
        }
    });

    yield call(result.pipe, file);

    const waitForFile = () => new Promise((resolve, reject) => {
        file
            .on('finish', () => {
                file.close(fileCloseErr => {
                    if (fileCloseErr) {
                        return reject(fileCloseErr);
                    }

                    return resolve(dest);
                });
            })
            .on('error', fileErr => {
                try {
                    fs.unlink(dest);
                }
                finally {
                    reject(fileErr);
                }
            });
    });

    yield call(waitForFile);
}

export function *getDiscogsReleaseId(discogs, artist, album) {
    const searchString = `${artist} - ${album}`;

    const database = yield call(discogs.database);

    const data = yield call(database.search, searchString);

    if (!(data && data.results)) {
        throw new Error('Bad result data from Discogs');
    }

    const releases = data.results.filter(result => result.id && result.type && result.type === 'release');
    if (!releases.length) {
        throw new Error('No results');
    }

    const releaseId = releases[0].id;

    return releaseId;
}

export function *getDiscogsArtworkFromReleaseId(discogs, releaseId, artist, album) {
    const database = yield call(discogs.database);

    const data = yield call(database.getRelease, releaseId);

    if (!(data && data.images && Array.isArray(data.images))) {
        throw new Error('Bad result data from Discogs');
    }

    const validImages = data.images.filter(image => image.resource_url);

    if (!validImages.length) {
        throw new Error('No artwork image');
    }
    const imageUrl = validImages[0].resource_url;

    try {
        const file = yield downloadArtwork(imageUrl, artist, album);

        return file;
    }
    catch (err) {
        throw new Error('Error downloading artwork image');
    }
}

export function *getDiscogsArtwork(artist, album) {
    const discogs = yield call(DiscogsClient, {
        consumerKey: config.discogs.consumerKey,
        consumerSecret: config.discogs.consumerSecret
    });

    const releaseId = yield getDiscogsReleaseId(discogs, artist, album);

    const artwork = yield getDiscogsArtworkFromReleaseId(discogs, releaseId, artist, album);

    return artwork;
}

export function *fetchNewAlbumArtwork(db, res, artist, album) {
    let file = null;
    let dbFile = null;
    let cacheable = true;
    let errorResult = false;

    yield call(db.collection(config.collections.artwork).insertOne, { artist, album, loading: true });

    try {
        file = yield getDiscogsArtwork(artist, album);

        dbFile = file;
    }
    catch (err) {
        file = ARTWORK_UNKNOWN_FILE;
        cacheable = false;

        errorResult = true;
    }

    yield call(db.collection(config.collections.artwork).updateOne, { artist, album }, {
        $set: { loading: false, error: errorResult, file: dbFile }
    });

    return { file, cacheable };
}

const fileExists = file => new Promise((resolve, reject) => {
    fs.stat(file, err => {
        if (err) {
            if (err.code === 'ENOENT') {
                return resolve(false);
            }

            return reject(err);
        }

        return resolve(true);
    });
});

export function *getAlbumArtwork(db, res, artist, album) {
    let file = null;
    let cacheable = true;

    const localCopy = yield call(db.collection(config.collections.artwork).findOne, { artist, album });

    if (localCopy) {
        if (localCopy.loading || localCopy.error) {
            file = ARTWORK_UNKNOWN_FILE;
            cacheable = false;
        }
        else {
            // don't try to serve a file which doesn't exist
            const localCopyExists = yield call(fileExists, localCopy.file);

            if (localCopyExists) {
                file = localCopy.file;
            }
        }
    }

    if (!file) {
        const result = yield fetchNewAlbumArtwork(db, res, artist, album);

        file = result.file;
        cacheable = result.cacheable;
    }

    return { file, cacheable };
}

export function *serveArtworkFile(res, file) {
    const contentType = getContentTypeFromFile(file);

    const buffer = yield call(getBufferFromFile, file);

    return res
        .header('Content-Type', contentType)
        .send(buffer);
}

export default function *routeArtwork(req, res, next) {
    req.dbInit = true;

    const encoded = req.params.encoded;

    let decoded = null;
    try {
        decoded = decodeArtistAlbum(encoded);
    }
    catch (err) {
        serveArtworkFile(res, ARTWORK_UNKNOWN_FILE);

        return next();
    }

    const { artist, album } = decoded;

    try {
        const existsInDatabaseResult = yield req.db
            .collection(config.collections.music)
            .find({
                'info.artist': artist,
                'info.album': album || null
            })
            .toArray();

        if (!existsInDatabaseResult.length) {
            return res
                .status(400)
                .json({ existsInDatabaseResult, artist, album, error: true, status: 'File not found in database' });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ error: true, status: 'Unknown error' });

        return next();
    }

    try {
        const { file } = yield getAlbumArtwork(req.db, res, artist, album);

        if (file) {
            try {
                yield serveArtworkFile(res, file);
            }
            catch (fileErr) {
                // the file was deleted, we should delete it in the database too
                yield req.db
                    .collection(config.collections.artwork)
                    .deleteOne({ artist, album });

                throw fileErr;
            }
        }
    }
    catch (err) {
        res
            .status(404)
            .json({ error: true, status: 'Not found' });
    }

    return next();
}

