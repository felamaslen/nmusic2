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
});

