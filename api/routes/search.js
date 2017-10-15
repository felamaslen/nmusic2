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

async function getSortedSearchResult(db, key, keyword, getId = false) {
    const maxResults = 5;

    const match = new RegExp(`(^|\\s)${keyword}`, 'i');

    const infoKey = `info.${key}`;

    let results = [];

    if (getId) {
        const resultsFind = await db
            .collection(config.collections.music)
            .find({ [infoKey]: match }, { '_id': 1, [infoKey]: 1 })
            .toArray();

        results = resultsFind.map(item => ({ id: item._id.toString(), item: item.info[key] }));
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

    if (getId) {
        return items;
    }

    return items.map(item => item.item);
}

async function routeSearch(req, res) {
    const keyword = req.params.keyword;

    try {
        const artists = await getSortedSearchResult(req.db, 'artist', keyword);
        const albums = await getSortedSearchResult(req.db, 'album', keyword);
        const titles = await getSortedSearchResult(req.db, 'title', keyword, true);

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

