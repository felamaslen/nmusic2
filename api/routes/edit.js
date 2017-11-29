import joi from 'joi';
import { ObjectID } from 'mongodb';

export default function *routeEdit(req, res, next) {
    req.dbInit = true;

    const schema = joi.object().keys({
        track: joi.number(),
        title: joi.string(),
        artist: joi.string(),
        album: joi.string()
    });

    const { error, value: fields } = joi.validate(req.body, schema);

    if (error || Object.keys(fields).length === 0) {
        res.status(400)
            .json({ error: true, status: 'Bad data input' });

        return next();
    }

    const _id = new ObjectID(req.params.id);

    const fieldsDeep = Object.keys(fields)
        .reduce((fieldsObj, key) => ({ ...fieldsObj, [`info.${key}`]: fields[key] }), {});

    try {
        yield req.db.collection('music')
            .updateOne({ _id }, { $set: fieldsDeep });

        res.json({ success: true });
    }
    catch (err) {
        res.status(500)
            .json({ error: true, status: 'Server error' });
    }

    return next();
}

