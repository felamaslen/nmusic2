/* eslint-disable no-invalid-this */
const co = require('co');
const methods = require('methods');
const isGenerator = require('is-generator');

function convertGenerators(handler) {
    if (!isGenerator.fn(handler)) {
        return handler;
    }

    return function wrapped(req, res, next) {
        Reflect.apply(co.wrap(handler), this, [req, res])
            .then(() => !res.finished && !res.seekable && next(), next);
    };
}

function wrapAppMethod(methodHandler) {
    return function method(...args) {
        return Reflect.apply(methodHandler, this, args.map(convertGenerators));
    };
}

function wrapParamMethod(route) {
    return function getRoute(name, handler) {
        return Reflect.apply(route, this, [name, convertGenerators(handler)]);
    };
}

function wrap(app) {
    methods.forEach(method => {
        app[method] = wrapAppMethod(app[method]);
    });

    app.param = wrapParamMethod(app.param);
    app.use = wrapAppMethod(app.use);
    app.all = wrapAppMethod(app.all);
    app.del = app.delete;

    const _route = app.route;
    app.route = function route(...args) {
        return wrap(Reflect.apply(_route, this, args));
    };

    return app;
}

module.exports = function wrapGenerators(express) {
    function expressGenerators() {
        return wrap(express());
    }

    expressGenerators.prototype = express;

    Object.assign(expressGenerators, express);

    if (express.Router) {
        expressGenerators.Router = function Router() {
            return wrap(new express.Router());
        };
    }

    return expressGenerators;
};

