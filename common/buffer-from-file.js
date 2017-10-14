const fs = require('fs');
const mime = require('mime-types');

function getContentTypeFromFile(file) {
    return mime.lookup(file) || 'application/octet-stream';
}

function getBufferFromFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, buffer) => {
            if (err) {
                return reject(err);
            }

            return resolve(buffer);
        });
    });
}

module.exports = { getContentTypeFromFile, getBufferFromFile };

