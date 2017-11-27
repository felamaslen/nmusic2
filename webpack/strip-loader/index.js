const utils = require('loader-utils');

module.exports = function stripLoader(content) {
    // eslint-disable-next-line no-invalid-this
    const opt = utils.parseQuery(this.query);

    if (opt.env) {
        return opt.env.reduce((processed, env) => {
            const replaceRegex = new RegExp(`\\/\\*\\sIF${env}\\s\\*\\/((.|\\n|\\r)*?)\\/\\*\\sENDIF\\s\\*\\/`, 'g');

            return processed.replace(replaceRegex, '');
        }, content);
    }

    return content;
};

