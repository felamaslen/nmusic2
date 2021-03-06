/**
 * Music directory scanner test
 */

/* eslint-disable id-length */

const { expect } = require('chai');
const path = require('path');
const fs = require('fs');

const TEST_DIRECTORY = path.join(__dirname, 'test-music');

const S = require('../../scripts/scan-music');

describe('Music scanner script', () => {
    let filesList = [];

    before(done => {
        fs.readdir(TEST_DIRECTORY, (err, files) => {
            if (err || files.length === 0) {
                throw new Error('No files in test directory');
            }

            filesList = filesList.concat(files);

            done();
        });
    });

    describe('getFilesList', () => {
        it('should get a list of files', async () => {
            const result = await S.getFilesList(path.join(__dirname));

            expect(result).to.be.an('array');

            const files = result.map(item => path.basename(item));
            expect(files).to.include('scan-music.spec.js');
            expect(files).to.include('test-file');
            expect(files).to.include('test-file-2.txt');
        });
        it('should accept a pattern match parameter', async () => {
            const result = await S.getFilesList(path.join(__dirname), /\.txt$/);

            expect(result).to.be.an('array');

            const files = result.map(item => path.basename(item));
            expect(files).to.not.include('scan-music.spec.js');
            expect(files).to.not.include('test-file');
            expect(files).to.include('test-file-2.txt');
        });
    });
});

