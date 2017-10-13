module.exports = {
    dbUri: process.env.MONGO_URI || '',
    discogs: {
        consumerKey: process.env.DISCOGS_CONSUMER_KEY || '',
        consumerSecret: process.env.DISCOGS_CONSUMER_SECRET || ''
    },
    collections: {
        music: 'music',
        artwork: 'artwork'
    },
    apiVersion: 1,
    scripts: {
        scanMusic: {
            filesPattern: /\.(ogg|mp3)$/,
            musicDirectory: process.env.MUSIC_DIRECTORY || ''
        }
    }
};

