import { expect } from 'chai';

import * as C from '../../src/constants/actions';
import * as A from '../../src/actions/audio-player.actions';

describe('Audio player actions', () => {
    describe('audioShuffleSet', () => {
        it('should return AUDIO_MODE_SHUFFLE_SET with status', () => {
            expect(A.audioShuffleSet('foo')).to.deep.equal({
                type: C.AUDIO_MODE_SHUFFLE_SET,
                payload: 'foo'
            });
        });
    });
    describe('audioVolumeSet', () => {
        it('should return AUDIO_VOLUME_SET with volume, remember parameters', () => {
            expect(A.audioVolumeSet(0.5, true)).to.deep.equal({
                type: C.AUDIO_VOLUME_SET,
                payload: { volume: 0.5, remember: true }
            });
        });
    });
});

