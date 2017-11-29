import config from '../../common/config';

import { getInfoFilterQuery, sortCaseInsensitiveIgnorePrefix } from '../helpers';

export default function routeFilterList(key, subKey = null) {
    return function *routeFilterListKeyed(req, res, next) {
        req.dbInit = true;

        let query = {};
        if (subKey && req.params[subKey]) {
            query = getInfoFilterQuery(req.params[subKey], subKey);
        }

        try {
            const results = yield req.db
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

        return next();
    };
}

