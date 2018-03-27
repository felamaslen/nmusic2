const winston = require('winston');

const logLevels = {
    production: 'info',
    development: 'debug',
    test: 'debug',
    default: 'verbose'
};

const getLogger = (suppress = false) => {
    if (suppress) {
        return new winston.Logger({ transports: [] });
    }

    const level = process.env.LOG_LEVEL ||
        logLevels[process.env.NODE_ENV || 'default'] ||
        logLevels.default;

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                level,
                json: false,
                colorize: true
            })
        ]
    });
};

module.exports = getLogger;

