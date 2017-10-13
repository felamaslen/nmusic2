const config = require('../../common/config');

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

async function getAlbumArtwork(db, artist, album) {
    const localCopy = await db
        .collection(config.collections.artwork)
        .findOne({ artist, album });

    if (localCopy) {
        if (localCopy[0].loading) {
            throw new Error('file loading');
        }

        return localCopy[0].file;
    }

    throw new Error('no file');
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
        const artworkFile = await getAlbumArtwork(req.db, artist, album);

        req.db.close();

        const contentType = getContentTypeFromFile(artworkFile);
        const buffer = await getBufferFromFile(artworkFile);

        return res
            .header('Content-Type', contentType)
            .send(buffer);
    }
    catch (err) {
        return next();
    }
}

module.exports = {
    routeArtwork
};

