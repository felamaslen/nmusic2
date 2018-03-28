const { ObjectID } = require('mongodb');

const {
    getContentTypeFromFile, getBufferFromFile
} = require('../../common/buffer-from-file');

function *serveSong(row, res) {
    if (!(row && row.length === 1)) {
        return res.status(404)
            .json({ status: 'Not found' });
    }

    const [{ file }] = row;

    const contentType = getContentTypeFromFile(file);

    const buffer = yield getBufferFromFile(file);

    res.header('Content-Type', contentType)
        .sendSeekable(buffer);

    res.seeking = true;

    return null;
}

function routePlay(config, db) {
    return function *playSong(req, res) {
        const id = req.params.id;
        if (!(id && id.length)) {
            return res.status(400)
                .json({ status: 'Invalid ID' });
        }

        let rowId = null;
        try {
            rowId = new ObjectID(id);
        }
        catch (err) {
            return res.status(400)
                .json({ status: 'Invalid ID' });
        }

        const row = yield db.collection(config.collections.music)
            .find({ _id: rowId })
            .toArray();

        yield serveSong(row, res);

        return null;
    };
}

function routePlayRandom(config, db) {
    return function *getRandomSong(req, res) {
        const row = yield db.collection(config.collections.music)
            .aggregate([{ $sample: { size: 1 } }])
            .toArray();

        if (row.length === 1) {
            const { _id, info } = row[0];

            res.json({ id: _id, ...info });
        }
        else {
            res.status(404)
                .json({ status: 'No songs' });
        }
    };
}

module.exports = { routePlay, routePlayRandom };

