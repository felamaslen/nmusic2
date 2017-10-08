module.exports = {
    dbUri: process.env.MONGO_URI || '',
    collections: {
        music: 'music'
    },
    scripts: {
        scanMusic: {
            filesPattern: /\.(ogg|mp3)$/,
            musicDirectory: process.env.MUSIC_DIRECTORY || ''
        }
    }
};

