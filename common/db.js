const { MongoClient } = require('mongodb');

function dbConnect(url, Client = MongoClient) {
    return new Promise((resolve, reject) => {
        Client.connect(url, (err, db) => {
            if (err) {
                return reject(err);
            }

            return resolve(db);
        });
    });
}

module.exports = {
    dbConnect
};

