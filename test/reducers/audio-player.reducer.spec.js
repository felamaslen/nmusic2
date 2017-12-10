/* eslint-disable id-length */

import { fromJS } from 'immutable';
import { expect } from 'chai';

import * as R from '../../src/reducers/audio-player.reducer';
import * as M from '../../src/constants/misc';

describe('Audio player reducer', () => {
    describe('setModeShuffle', () => {
        it('should set the shuffle mode', () => {
            expect(R.setModeShuffle(fromJS({ player: { foo: 'bar', shuffle: 'baz' } }), 'foo')
                .getIn(['player', 'shuffle']))
                .to.equal('foo');
        });
        it('should toggle the shuffle mode if no status was given', () => {
            expect(R.setModeShuffle(fromJS({ player: { shuffle: M.SHUFFLE_NONE } }))
                .getIn(['player', 'shuffle']))
                .to.equal(M.SHUFFLE_ALL);

            expect(R.setModeShuffle(fromJS({ player: { shuffle: M.SHUFFLE_ALL } }))
                .getIn(['player', 'shuffle']))
                .to.equal(M.SHUFFLE_NONE);
        });
    });
});

