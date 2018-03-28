const { getInfoFilterQuery, sortCaseInsensitiveIgnorePrefix } = require('../helpers');

function routeFilterList(config, db, logger, key, subKey = null) {
    return function *getFilterList(req, res) {
        let query = {};
        if (subKey && req.params[subKey]) {
            query = getInfoFilterQuery(req.params[subKey], subKey);
        }

        const results = yield db.collection(config.collections.music)
            .distinct(`info.${key}`, query)

        const items = results.map(item => item || `Unknown ${key}`)
            .sort(sortCaseInsensitiveIgnorePrefix);

        res.json(items);
    };
}

module.exports = {
    routeFilterList
};

