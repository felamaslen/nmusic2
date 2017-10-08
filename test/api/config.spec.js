const { expect } = require('chai');

const config = require('../../api/config');

describe('Config', () => {
    describe('scripts', () => {
        it('should be defined', () => expect(config.scripts).to.be.an('object'));
        describe('scanMusic', () => {
            it('should be defined', () => expect(config.scripts.scanMusic).to.be.an('object'));
            it('should define filesPattern', () => {
                expect(config.scripts.scanMusic.filesPattern).to.be.a('regexp');
            });
        });
    });
});

