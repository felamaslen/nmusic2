module.exports = {
    dbUri: process.env.MONGO_URI || '',
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

