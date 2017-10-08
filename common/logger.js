const colors = require('colors');
const dateformat = require('dateformat');

function formatNow() {
    const now = new Date();

    return dateformat(now, 'isoDateTime');
}

function logger(key, ...args) {
    let pre = `[${key}@${formatNow()}]`;
    let post = args.join(' ');

    if (key === 'FATAL') {
        pre = colors.red.underline(pre);
        post = colors.red(post);
    }
    else if (key === 'ERROR') {
        pre = colors.red(pre);
        post = colors.red(post);
    }
    else if (key === 'WARN') {
        pre = colors.yellow(pre);
        post = colors.yellow(post);
    }
    else if (key === 'MSG') {
        pre = colors.grey(pre);
    }
    else if (key === 'DEBUG') {
        pre = colors.cyan(pre);
        post = colors.cyan(post);
    }
    else if (key === 'SUCCESS') {
        pre = colors.green(pre);
    }

    console.log(pre, post);
}

module.exports = logger;

