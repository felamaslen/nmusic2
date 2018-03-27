const joi = require('joi');
const { ObjectID } = require('mongodb');

function routeEdit(config, db) {
    return async (req, res, next) => {
        const schema = joi.object().keys({
            ids: joi.array()
                .items(joi.string())
                .min(1)
                .unique()
                .required(),
            track: joi.number(),
            title: joi.string(),
            artist: joi.string(),
            album: joi.string()
        });

        const { error, value } = joi.validate(req.body, schema);

        const { ids, ...fields } = value;

        if (error || Object.keys(fields).length === 0) {
            res.status(400)
                .json({ error: true, status: 'Bad data input' });

            return next();
        }

        const _ids = ids.map(id => new ObjectID(id));

        const fieldsDeep = Object.keys(fields)
            .reduce((fieldsObj, key) => ({ ...fieldsObj, [`info.${key}`]: fields[key] }), {});

        try {
            await db.collection('music')
                .updateMany({ _id: { $in: _ids } }, { $set: fieldsDeep });

            res.json({ success: true });
        }
        catch (err) {
            res.status(500)
                .json({ error: true, status: 'Server error' });
        }

        return next();
    };
}

module.exports = {
    routeEdit
};

