import { expect } from 'chai';
import * as R from '../../../api/routes/artwork';
import { call } from '../../../api/helpers/effects';
import fs from 'fs';
import path from 'path';
import request from 'request';

describe('Artwork route', () => {
    describe('decodeArtistAlbum', () => {
        it('should base64 encode the artist and album', () => {
            expect(R.encodeArtistAlbum('foo', 'bar')).to.equal('Zm9vL2Jhcg==');
        });
    });
    describe('decodeArtistAlbum', () => {
        it('should decode artist and album from base64 string', () => {
            expect(R.decodeArtistAlbum('Zm9vL2Jhcg==')).to.deep.equal({
                artist: 'foo',
                album: 'bar'
            });
        });
    });
    describe('getExtension', () => {
        it('should return the extension of a filename, if there is one', () => {
            expect(R.getExtension('file.jpg')).to.equal('jpg');
            expect(R.getExtension('file.jpeg')).to.equal('jpeg');
            expect(R.getExtension('file')).to.equal('');
            expect(R.getExtension('/path/to/file.png')).to.equal('png');
        });
    });
    describe('downloadArtwork', () => {
        it('should work as expected', () => {
            const gen = R.downloadArtwork('http://example.com/some/artwork.jpg', 'foo', 'bar');

            let result = gen.next();

            expect(result.value).to.deep.equal(call(fs.createWriteStream,
                path.join(__dirname, '../../../.artwork/Zm9vL2Jhcg==.jpg')));

            const mockFile = {};

            result = gen.next(mockFile);

            expect(result.value).to.deep.equal(call(request.get, {
                url: 'http://example.com/some/artwork.jpg',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
                }
            }));
        });
    });
});

