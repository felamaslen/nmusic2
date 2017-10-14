const path = require('path');
const fs = require('fs');
const request = require('request');
const DiscogsClient = require('disconnect').Client;

const config = require('../../common/config');

const ARTWORK_PATH = path.join(__dirname, '../../.artwork');
const ARTWORK_UNKNOWN_FILE = `${ARTWORK_PATH}/unknown-artwork.png`;

const {
    getContentTypeFromFile, getBufferFromFile
} = require('../../common/buffer-from-file');

function encodeArtistAlbum(artist, album) {
    return Buffer.from(`${artist}/${album}`).toString('base64');
}

function decodeArtistAlbum(encoded) {
    const decoded = String(Buffer.from(encoded, 'base64'));

    const match = decoded.match(/^(.+)\/(.+)$/);

    const artist = match[1];
    const album = match[2];

    return { artist, album };
}

function getExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');

    if (lastDotIndex === -1) {
        return '';
    }

    return filename.substring(lastDotIndex + 1);
}

function downloadArtwork(url, artist, album) {
    const dest = `${ARTWORK_PATH}/${encodeArtistAlbum(artist, album)}.${getExtension(url)}`;

    const req = request.defaults({
        jar: true,
        rejectUnauthorized: false,
        followAllRedirects: true
    });

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        req
            .get({
                url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
                }
            })
            .pipe(file);

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
                fs.unlink(dest);

                reject(fileErr);
            });
    });
}

async function getDiscogsReleaseId(discogs, artist, album) {
    const searchString = `${artist} - ${album}`;

    const data = await discogs.database().search(searchString);

    if (!data || !data.results) {
        throw new Error('Bad result data from Discogs');
    }

    const releases = data.results.filter(result => result.id && result.type && result.type === 'release');
    if (!releases.length) {
        throw new Error('No results');
    }

    const releaseId = releases[0].id;

    return releaseId;
}

async function getDiscogsArtworkFromReleaseId(discogs, releaseId, artist, album) {
    const data = await discogs.database().getRelease(releaseId);

    if (!data || !data.images || !Array.isArray(data.images)) {
        throw new Error('Bad result data from Discogs');
    }

    const validImages = data.images.filter(image => image.resource_url);

    if (!validImages.length) {
        throw new Error('No artwork image');
    }
    const imageUrl = validImages[0].resource_url;

    try {
        const file = await downloadArtwork(imageUrl, artist, album);

        return file;
    }
    catch (err) {
        throw new Error('Error downloading artwork image');
    }
}

async function getDiscogsArtwork(artist, album) {
    const discogs = new DiscogsClient({
        consumerKey: config.discogs.consumerKey,
        consumerSecret: config.discogs.consumerSecret
    });

    const releaseId = await getDiscogsReleaseId(discogs, artist, album);

    const artwork = await getDiscogsArtworkFromReleaseId(discogs, releaseId, artist, album);

    return artwork;
}

async function fetchNewAlbumArtwork(db, res, artist, album) {
    let file = null;
    let dbFile = null;
    let cacheable = true;
    let errorResult = false;

    await db
        .collection(config.collections.artwork)
        .insertOne({ artist, album, loading: true });

    try {
        file = await getDiscogsArtwork(artist, album);

        dbFile = file;
    }
    catch (err) {
        file = ARTWORK_UNKNOWN_FILE;
        cacheable = false;

        errorResult = true;
    }

    await db
        .collection(config.collections.artwork)
        .updateOne({ artist, album }, {
            $set: { loading: false, error: errorResult, file: dbFile }
        });

    return { file, cacheable };
}

async function getAlbumArtwork(db, res, artist, album) {
    let file = null;
    let cacheable = true;

    const localCopy = await db
        .collection(config.collections.artwork)
        .findOne({ artist, album });

    if (localCopy) {
        if (localCopy.loading || localCopy.error) {
            file = ARTWORK_UNKNOWN_FILE;
            cacheable = false;
        }
        else {
            file = localCopy.file;
        }
    }
    else {
        const result = await fetchNewAlbumArtwork(db, res, artist, album);

        file = result.file;
        cacheable = result.cacheable;
    }

    return { file, cacheable };
}

async function routeArtwork(req, res, next) {
    const encoded = req.params.encoded;

    let decoded = null;
    try {
        decoded = decodeArtistAlbum(encoded);
    }
    catch (err) {
        return next();
    }

    const { artist, album } = decoded;

    try {
        const existsInDatabaseResult = await req.db
            .collection(config.collections.music)
            .find({
                'info.artist': artist,
                'info.album': album
            })
            .toArray();

        if (!existsInDatabaseResult.length) {
            return next();
        }
    }
    catch (err) {
        req.db.close();

        return res
            .status(500)
            .json({ error: true, status: 'Unknown error' });
    }

    try {
        const { file } = await getAlbumArtwork(req.db, res, artist, album);

        req.db.close();

        if (file) {
            const contentType = getContentTypeFromFile(file);
            const buffer = await getBufferFromFile(file);

            return res
                .header('Content-Type', contentType)
                .send(buffer);
        }
    }
    catch (err) {
        return next();
    }

    return null;
}

module.exports = {
    routeArtwork
};
