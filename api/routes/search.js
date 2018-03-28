const sortByMatchingFirst = keyword => {
    const match = new RegExp(`^${keyword}`, 'i');

    return (prev, next) => {
        const prevMatches = prev.item.match(match);
        const nextMatches = next.item.match(match);

        if (prevMatches && !nextMatches) {
            return -1;
        }

        if (!prevMatches && nextMatches) {
            return 1;
        }

        return 0;
    };
};

function getSearchRegex(keyword) {
    return new RegExp(`(^|\\s)${keyword}`, 'i');
}

function *getSortedArtists(config, db, keyword) {
    const match = getSearchRegex(keyword);

    const results = yield db.collection(config.collections.music)
        .distinct('info.artist', { 'info.artist': match });

    return results
        .map(item => ({ item }))
        .sort(sortByMatchingFirst(keyword))
        .slice(0, config.searchMaxResults)
        .map(({ item }) => item);
}

function *getSortedAlbums(config, db, keyword) {
    const match = getSearchRegex(keyword);

    const results = yield db
        .collection(config.collections.music)
        .aggregate([
            {
                $match: {
                    'info.album': match
                }
            },
            {
                $unwind: '$info'
            },
            {
                $match: {
                    'info.album': match
                }
            },
            {
                $group: {
                    _id: {
                        album: '$info.album',
                        artist: '$info.artist'
                    }
                }
            },
            {
                $group: {
                    _id: '$_id.album',
                    artist: {
                        $push: '$_id.artist'
                    }
                }
            }
        ])
        .toArray();

    return results
        .map(row => ({
            item: row._id,
            artist: row.artist[0]
        }))
        .sort(sortByMatchingFirst(keyword))
        .slice(0, config.searchMaxResults)
        .map(row => ({ artist: row.artist, album: row.item }));
}

function *getSortedSongs(config, db, keyword) {
    const match = getSearchRegex(keyword);

    const results = yield db
        .collection(config.collections.music)
        .find({ 'info.title': match }, { file: 0 })
        .toArray();

    return results
        .map(row => ({ ...row, item: row.info.title }))
        .sort(sortByMatchingFirst(keyword))
        .slice(0, config.searchMaxResults)
        .map(row => ({ id: row._id, ...row.info }));
}

function routeSearch(config, db) {
    return function *getSearchResults(req, res) {
        const keyword = req.params.keyword;

        const artists = yield getSortedArtists(config, db, keyword);
        const albums = yield getSortedAlbums(config, db, keyword);
        const titles = yield getSortedSongs(config, db, keyword);

        res.json({ artists, albums, titles });
    };
}

module.exports = { routeSearch };

