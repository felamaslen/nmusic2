const fs = require('fs');
const request = require('request');
const DiscogsClient = require('disconnect').Client;

const { getContentTypeFromFile, getBufferFromFile } = require('../../common/buffer-from-file');

function encodeArtistAlbum(artist, album) {
    return Buffer.from(`${artist}/${album}`).toString('base64');
}

function decodeArtistAlbum(encoded) {
    const decoded = String(Buffer.from(encoded, 'base64'));

    const match = decoded.match(/^(.+?)\/(.*)$/);

    const artist = decodeURIComponent(match[1]);
    const album = decodeURIComponent(match[2]) || '';

    if (!artist.length) {
        throw new Error('Must supply artist');
    }

    return { artist, album };
}

function getExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');

    if (lastDotIndex === -1) {
        return '';
    }

    return filename.substring(lastDotIndex + 1);
}

function downloadArtwork(config, url, artist, album) {
    const dest = `${config.artwork.path}/${encodeArtistAlbum(artist, album)}.${getExtension(url)}`;

    const req = request.defaults({
        jar: true,
        rejectUnauthorized: false,
        followAllRedirects: true
    });

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        req.get({
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
                try {
                    fs.unlink(dest);
                }
                finally {
                    reject(fileErr);
                }
            });
    });
}

function *getDiscogsReleaseId(logger, discogs, artist, album) {
    const searchString = `${artist} - ${album}`;

    const data = yield discogs.database().search(searchString);

    if (!(data && data.results)) {
        logger.warn('Bad artwork data from Discogs, for:', { artist, album });

        throw new Error('Bad result data from Discogs');
    }

    const releases = data.results.filter(({ id, type }) => id && type && type === 'release');
    if (!releases.length) {
        logger.warn('No Discogs artwork results, for:', { artist, album });

        throw new Error('No results');
    }

    return releases[0].id;
}

function *getDiscogsArtworkFromReleaseId(config, logger, discogs, releaseId, artist, album) {
    const data = yield discogs.database().getRelease(releaseId);

    if (!(data && data.images && Array.isArray(data.images))) {
        logger.warn('No artwork on Discogs result, for:', { artist, album });

        throw new Error('Bad result data from Discogs');
    }

    const validImages = data.images.filter(image => image.resource_url);

    if (!validImages.length) {
        logger.warn('No artwork results have a resource ID, for:', { artist, album });

        throw new Error('No artwork image');
    }
    const imageUrl = validImages[0].resource_url;

    try {
        const file = yield downloadArtwork(config, imageUrl, artist, album);

        return file;
    }
    catch (err) {
        logger.error('Error downloading artwork image, for:', { artist, album });

        throw new Error('Error downloading artwork image');
    }
}

function *getDiscogsArtwork(config, logger, artist, album) {
    if (!(config.discogs.consumerKey && config.discogs.consumerSecret)) {
        throw new Error('No Discogs API key configured');
    }

    const discogs = new DiscogsClient({
        consumerKey: config.discogs.consumerKey,
        consumerSecret: config.discogs.consumerSecret
    });

    const releaseId = yield getDiscogsReleaseId(logger, discogs, artist, album);

    const artwork = yield getDiscogsArtworkFromReleaseId(config, logger, discogs, releaseId, artist, album);

    return artwork;
}

function *fetchNewAlbumArtwork(config, logger, db, res, artist, album) {
    let file = null;
    let dbFile = null;
    let cacheable = true;
    let errorResult = false;

    yield db.collection(config.collections.artwork)
        .insertOne({ artist, album, loading: true });

    try {
        file = yield getDiscogsArtwork(config, logger, artist, album);

        dbFile = file;
    }
    catch (err) {
        file = config.artwork.unknownFile;
        cacheable = false;

        errorResult = true;
    }

    yield db.collection(config.collections.artwork)
        .updateOne({ artist, album }, {
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

function *getAlbumArtwork(config, logger, db, res, artist, album) {
    let file = null;
    let cacheable = true;

    const localCopy = yield db.collection(config.collections.artwork)
        .findOne({ artist, album });

    if (localCopy) {
        if (localCopy.loading || localCopy.error) {
            file = config.artwork.unknownFile;
            cacheable = false;
        }
        else {
            // don't try to serve a file which doesn't exist
            const localCopyExists = yield fileExists(localCopy.file);

            if (localCopyExists) {
                file = localCopy.file;
            }
        }
    }

    if (!file) {
        const result = yield fetchNewAlbumArtwork(config, logger, db, res, artist, album);

        file = result.file;
        cacheable = result.cacheable;
    }

    return { file, cacheable };
}

function *serveArtworkFile(res, file) {
    const contentType = getContentTypeFromFile(file);

    const buffer = yield getBufferFromFile(file);

    return res.header('Content-Type', contentType)
        .send(buffer);
}

function routeArtwork(config, db, logger) {
    return function *getArtwork(req, res) {
        try {
            const { artist, album } = decodeArtistAlbum(req.params.encoded);

            const existsInDatabaseResult = yield db.collection(config.collections.music)
                .find({
                    'info.artist': artist,
                    'info.album': album || null
                })
                .toArray();

            if (!existsInDatabaseResult.length) {
                return res.status(400)
                    .json({
                        existsInDatabaseResult,
                        artist,
                        album,
                        status: 'File not found in database'
                    });
            }

            const { file } = yield getAlbumArtwork(config, logger, db, res, artist, album);

            const exists = yield fileExists(file);

            if (!(file && exists)) {
                if (file) {
                    // the file was deleted, we should delete it in the database too

                    yield db.collection(config.collections.artwork)
                        .deleteOne({ artist, album });
                }

                return res.status(404)
                    .json({ error: true, status: 'Not found' });
            }

            yield serveArtworkFile(res, file);

            return null;
        }
        catch (err) {
            return serveArtworkFile(res, config.artwork.unknownFile);
        }
    };
}

module.exports = {
    routeArtwork
};

