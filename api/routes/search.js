import config from '../../common/config';

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

async function getSortedArtists(db, keyword) {
    const match = getSearchRegex(keyword);

    const results = await db.collection(config.collections.music)
        .distinct('info.artist', { 'info.artist': match });

    return results
        .map(item => ({ item }))
        .sort(sortByMatchingFirst(keyword))
        .slice(0, config.searchMaxResults)
        .map(({ item }) => item);
}

async function getSortedAlbums(db, keyword) {
    const match = getSearchRegex(keyword);

    const results = await db
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

async function getSortedSongs(db, keyword) {
    const match = getSearchRegex(keyword);

    const results = await db
        .collection(config.collections.music)
        .find({ 'info.title': match }, { file: 0 })
        .toArray();

    return results
        .map(row => ({ ...row, item: row.info.title }))
        .sort(sortByMatchingFirst(keyword))
        .slice(0, config.searchMaxResults)
        .map(row => ({ id: row._id, ...row.info }));
}

export default async function routeSearch(req, res, next) {
    const keyword = req.params.keyword;

    try {
        const artists = await getSortedArtists(req.db, keyword);
        const albums = await getSortedAlbums(req.db, keyword);
        const titles = await getSortedSongs(req.db, keyword);

        res.json({ artists, albums, titles });
    }
    catch (err) {
        res
            .status(500)
            .json({ err: err.message, error: true, status: 'Unknown error' });
    }

    return next();
}

