const { Router } = require('express');
const bodyParser = require('body-parser');

const apiConfig = require('../config');

function apiRoutes() {
    const router = new Router();

    router.get('/', (req, res) => {
        res
            .status(400)
            .json({
                error: true,
                status: 'API not implemented!'
            });
    });

    return router;
}

function setup(app) {
    app.use(bodyParser.json());

    app.use(`/api/v${apiConfig.version}`, apiRoutes());
}

module.exports = setup;

