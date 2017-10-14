const config = require('../../common/config');

function getSortString(item) {
    return item
        .replace(/^the\s+/i, '')
        .toLowerCase();
}

function sortCaseInsensitiveIgnorePrefix(prev, next) {
    const prevSortString = getSortString(prev);
    const nextSortString = getSortString(next);

    if (prevSortString < nextSortString) {
        return -1;
    }

    if (prevSortString > nextSortString) {
        return 1;
    }

    return 0;
}

function routeFilterList(key) {
    return async (req, res) => {
        try {
            const results = await req.db
                .collection(config.collections.music)
                .distinct(`info.${key}`)

            const items = results
                .map(item => item || `Unknown ${key}`)
                .sort(sortCaseInsensitiveIgnorePrefix);

            res.json(items);
        }
        catch (err) {
            res
                .status(500)
                .json({ error: true, status: 'Database error' });
        }
        finally {
            req.db.close();
        }
    };
}

module.exports = {
    routeFilterList
};

