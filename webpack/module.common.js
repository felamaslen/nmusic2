module.exports = {
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
                publicPath: './'
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
};

