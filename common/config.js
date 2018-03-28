if (process.env.DOTENV_INJECT === 'true' ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test') {

    require('dotenv').config(); // eslint-disable-line global-require
}

const path = require('path');

module.exports = {
    dbUri: process.env.MONGO_URI || '',
    webUri: process.env.WEB_URI || 'http://localhost:3000',
    discogs: {
        consumerKey: process.env.DISCOGS_CONSUMER_KEY || '',
        consumerSecret: process.env.DISCOGS_CONSUMER_SECRET || ''
    },
    collections: {
        music: 'music',
        artwork: 'artwork'
    },
    apiVersion: 1,
    searchMaxResults: 5,
    scripts: {
        scanMusic: {
            filesPattern: /\.(ogg|mp3)$/,
            musicDirectory: process.env.MUSIC_DIRECTORY || ''
        }
    },
    artwork: {
        path: process.env.ARTWORK_PATH || path.join(__dirname, '../.artwork'),
        unknownFile: path.join(__dirname, '../api/unknown-artwork.png')
    }
};

