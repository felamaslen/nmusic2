const path = require('path');

const SpritesmithPlugin = require('webpack-spritesmith');

module.exports = (...plugins) => [
    ...plugins,
    new SpritesmithPlugin({
        src: {
            cwd: path.join(__dirname, '../src/images/ico'),
            glob: '**/*.png'
        },
        target: {
            image: path.join(__dirname, '../src/images/sprite/sprite.png'),
            css: path.join(__dirname, '../src/images/sprite/sprite.scss')
        },
        apiOptions: {
            cssImageRef: '~sprite.png'
        },
        retina: '@2x',
        spritesmithOptions: {
            padding: 2
        }
    })
];

