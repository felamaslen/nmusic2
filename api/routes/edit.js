const joi = require('joi');
const { ObjectID } = require('mongodb');

function routeEdit(config, db) {
    return function *editSongs(req, res) {
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
            return res.status(400)
                .json({ status: 'Bad data input' });
        }

        const _ids = ids.map(id => new ObjectID(id));

        const fieldsDeep = Object.keys(fields)
            .reduce((fieldsObj, key) => ({ ...fieldsObj, [`info.${key}`]: fields[key] }), {});

        yield db.collection('music')
            .updateMany({ _id: { $in: _ids } }, { $set: fieldsDeep });

        return res.json({ success: true });
    };
}

module.exports = {
    routeEdit
};

