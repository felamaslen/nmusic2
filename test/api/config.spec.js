const { expect } = require('chai');

require('dotenv').config();

const config = require('../../common/config');

describe('Config', () => {
    it('should define dbUri', () => expect(config.dbUri).to.be.a('string').lengthOf.greaterThan(0));

    describe('collections', () => {
        it('should be defined', () => expect(config.collections).to.be.an('object'));

        it('should define music', () => expect(config.collections.music).to.be.a('string'));
    });

    it('should define apiVersion', () => expect(config.apiVersion).to.be.a('number'));

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

