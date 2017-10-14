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

function routeFilterList(key, subKey = null) {
    return async (req, res) => {
        let query = {};
        if (subKey && req.params[subKey]) {
            const filter = req.params[subKey]
                .split(',')
                .map(item => ({ [`info.${subKey}`]: decodeURIComponent(item) }));

            query = { $or: filter };
        }

        try {
            const results = await req.db
                .collection(config.collections.music)
                .distinct(`info.${key}`, query)

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

