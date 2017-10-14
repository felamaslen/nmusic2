/* eslint-disable id-length */

const { expect } = require('chai');

const D = require('../../common/db');

class MockMongoClient {
    static connect(url, callback) {
        const urlToConnect = 'test_url_good';

        if (url !== urlToConnect) {
            return callback(new Error('test error (bad url)'));
        }

        return callback(null, 'test_db_obj');
    }
}

describe('Database', () => {
    describe('dbConnect', () => {
        it('should connect to the mock mongo client', async () => {
            const db = await D.dbConnect('test_url_good', MockMongoClient);

            expect(db).to.equal('test_db_obj');
        });
        it('should handle errors', async () => {
            try {
                await D.dbConnect('test_url_bad', MockMongoClient);

                expect.fail();
            }
            catch (err) {
                expect(err.message).to.equal('test error (bad url)');
            }
        });
    });
});

