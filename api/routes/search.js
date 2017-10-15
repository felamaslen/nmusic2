const config = require('../../common/config');

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

async function getSortedSearchResult(db, key, keyword, getRows = null) {
    const maxResults = 5;

    const match = new RegExp(`(^|\\s)${keyword}`, 'i');

    const infoKey = `info.${key}`;

    let results = [];

    if (getRows) {
        const fields = getRows.reduce((last, item) => {
            last[item] = 1;

            return last;
        }, {});

        if (getRows.length) {
            if (!(infoKey in fields)) {
                fields[infoKey] = 1;
            }

            if (!('_id' in fields)) {
                fields._id = 0;
            }
        }

        const resultsFind = await db
            .collection(config.collections.music)
            .find({ [infoKey]: match }, fields)
            .toArray();

        results = resultsFind.map(row => ({ row, item: row.info[key] }));
    }
    else {
        const resultsDistinct = await db
            .collection(config.collections.music)
            .distinct(`info.${key}`, { [`info.${key}`]: match });

        results = resultsDistinct.map(item => ({ item }));
    }

    const items = results
        .sort(sortByMatchingFirst(keyword))
        .slice(0, maxResults);

    if (getRows) {
        return items.map(item => {
            const result = {};
            if ('_id' in item.row) {
                result.id = item._id;
            }

            return { ...result, ...item.row.info };
        });
    }

    return items.map(item => item.item);
}

async function routeSearch(req, res) {
    const keyword = req.params.keyword;

    try {
        const artists = await getSortedSearchResult(req.db, 'artist', keyword);
        const albums = await getSortedSearchResult(req.db, 'album', keyword, ['info.artist']);
        const titles = await getSortedSearchResult(req.db, 'title', keyword, []);

        res.json({ artists, albums, titles });
    }
    catch (err) {
        console.log(err.stack);
        res
            .status(500)
            .json({ err: err.message, error: true, status: 'Unknown error' });
    }
}

module.exports = { routeSearch };

