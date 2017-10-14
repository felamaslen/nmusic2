const config = require('../../common/config');

async function routeSongsList(req, res) {
    const query = ['artist', 'album'].reduce((filter, item) => {
        if (req.query[item]) {
            filter[`info.${item}`] = req.query[item];
        }

        return filter;
    }, {});

    try {
        const results = await req.db
            .collection(config.collections.music)
            .find(query)
            .toArray();

        const songList = results
            .map(result => [
                result._id,
                result.info.title,
                result.info.artist,
                result.info.album,
                result.info.year,
                Math.round(result.info.duration),
                result.info.track
            ]);

        res.json(songList);
    }
    catch (err) {
        res
            .status(500)
            .json({ error: true, status: 'Database error' });
    }
    finally {
        req.db.close();
    }
}

module.exports = {
    routeSongsList
};

