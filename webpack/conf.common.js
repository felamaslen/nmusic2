const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
    entry: ['./src/index'],
    resolve: {
        modules: ['node_modules', path.join(__dirname, '../src/images/sprite')],
        extensions: ['*', '.js', '.json']
    },
    resolveLoader: {
        modules: ['node_modules', __dirname]
    },
    plugins: [
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
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: 'babel-loader'
            },
            {
                test: /favicon\.png/,
                exclude: /node_modules/,
                loader: 'file-loader',
                query: {
                    name: 'favicon.ico',
                    publicPath: '../'
                }
            },
            {
                test: /\.(png|jpg|wav|mp(3|4|eg))(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: [/favicon\.png/, /node_modules/],
                loader: 'file-loader',
                query: {
                    name: 'assets/[hash].[ext]',
                    publicPath: '../'
                }
            },
            {
                test: /\.(woff2?|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                exclude: /node_modules/,
                loader: 'url-loader'
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: [/fonts\.scss$/, /node_modules/],
                enforce: 'pre',
                loaders: 'import-glob-loader'
            }
        ]
    }
};

