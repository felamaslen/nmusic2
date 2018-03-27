const { getInfoFilterQuery, sortCaseInsensitiveIgnorePrefix } = require('../helpers');

function routeFilterList(config, db, logger, key, subKey = null) {
    return async (req, res, next) => {
        let query = {};
        if (subKey && req.params[subKey]) {
            query = getInfoFilterQuery(req.params[subKey], subKey);
        }

        try {
            const results = await db.collection(config.collections.music)
                .distinct(`info.${key}`, query)

            const items = results.map(item => item || `Unknown ${key}`)
                .sort(sortCaseInsensitiveIgnorePrefix);

            res.json(items);
        }
        catch (err) {
            res
                .status(500)
                .json({ error: true, status: 'Database error' });
        }

        return next();
    };
}

module.exports = {
    routeFilterList
};

