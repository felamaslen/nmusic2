const { ObjectID } = require('mongodb');

const config = require('../../common/config');

const {
    getContentTypeFromFile, getBufferFromFile
} = require('../../common/buffer-from-file');

async function routePlay(req, res) {
    const id = req.params.id;

    if (!id || !id.length) {
        res
            .status(400)
            .json({ error: true, status: 'Invalid ID' });

        return;
    }

    const _id = new ObjectID(id);

    let row = null;
    try {
        row = await req.db
            .collection(config.collections.music)
            .find({ _id })
            .toArray();
    }
    catch (err) {
        res
            .status(500)
            .json({ error: true, status: 'Unknown server error' });

        return;
    }
    finally {
        req.db.close();
    }

    if (!row || row.length !== 1) {
        res
            .status(404)
            .json({ error: true, status: 'Not found' });

        return;
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

module.exports = {
    routePlay
};

