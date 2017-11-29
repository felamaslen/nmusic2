const { ObjectID } = require('mongodb');

const config = require('../../common/config');

const {
    getContentTypeFromFile, getBufferFromFile
} = require('../../common/buffer-from-file');

async function serveSong(row, res) {
    if (!(row && row.length === 1)) {
        res
            .status(404)
            .json({ error: true, status: 'Not found' });
    }

    const file = row[0].file;

    try {
        const contentType = getContentTypeFromFile(file);

        const buffer = await getBufferFromFile(file);

        res
            .header('Content-Type', contentType)
            .sendSeekable(buffer);
    }
    catch (err) {
        res
            .status(500)
            .json({ error: true, status: 'Couldn\'t read file' });
    }
}

async function routePlay(req, res, next) {
    const id = req.params.id;
    if (!(id && id.length)) {
        res
            .status(400)
            .json({ error: true, status: 'Invalid ID' });

        return next();
    }

    let _id = null;

    try {
        _id = new ObjectID(id);
    }
    catch (err) {
        res
            .status(400)
            .json({ error: true, status: 'Bad ID' });

        return next();
    }

    try {
        const row = await req.db
            .collection(config.collections.music)
            .find({ _id })
            .toArray();

        serveSong(row, res);
    }
    catch (err) {
        res
            .status(500)
            .json({ error: true, status: 'Unknown server error' });
    }

    return next();
}

async function routePlayRandom(req, res, next) {
    try {
        const row = await req.db
            .collection(config.collections.music)
            .aggregate([{ $sample: { size: 1 } }])
            .toArray();

        if (row.length === 1) {
            const { _id, info } = row[0];

            res.json({ id: _id, ...info });
        }
        else {
            res
                .status(404)
                .json({ error: true, status: 'No songs' });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ error: true, status: 'Unknown server error' });
    }

    return next();
}

module.exports = { routePlay, routePlayRandom };

