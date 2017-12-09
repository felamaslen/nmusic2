/* eslint-disable prefer-reflect */
import { fromJS } from 'immutable';
import { expect } from 'chai';
import axios from 'axios';
import { testSaga } from 'redux-saga-test-plan';

import * as S from '../../src/sagas/audio.saga.js';
import * as A from '../../src/actions/audio-player.actions';
import * as M from '../../src/constants/misc';

describe('Audio saga', () => {
    describe('selectSongLoaded', () => {
        it('should return true iff there is a song loaded', () => {
            expect(S.selectSongLoaded(fromJS({ player: { current: null } }))).to.equal(false);
            expect(S.selectSongLoaded(fromJS({ player: { current: 'foo' } }))).to.equal(true);
        });
    });

    describe('selectShuffleStatus', () => {
        it('should return true iff the player is set to shuffle', () => {
            expect(S.selectShuffleStatus(fromJS({ player: { shuffle: M.SHUFFLE_NONE } }))).to.equal(false);
            expect(S.selectShuffleStatus(fromJS({ player: { shuffle: M.SHUFFLE_ALL } }))).to.equal(true);
        });
    });

    describe('playRandomSong', () => {
        it('should fetch and play a random song', () => {
            return testSaga(S.playRandomSong)
                .next()
                .select(S.selectSongLoaded)
                .next(false)
                .select(S.selectShuffleStatus)
                .next(true)
                .call(axios.get, 'api/v1/play/random')
                .next({ data: { foo: 'bar' } })
                .put(A.audioFileLoaded(fromJS({ foo: 'bar' })))
                .next()
                .isDone();
        });
        it('should do nothing if set not to shuffle', () => {
            return testSaga(S.playRandomSong)
                .next()
                .select(S.selectSongLoaded)
                .next(false)
                .select(S.selectShuffleStatus)
                .next(false)
                .isDone();
        });
        it('should do nothing if a song is already loaded', () => {
            return testSaga(S.playRandomSong)
                .next()
                .select(S.selectSongLoaded)
                .next(true)
                .select(S.selectShuffleStatus)
                .next(true)
                .isDone();
        });
        it('should do nothing if an error occurs with the request', () => {
            return testSaga(S.playRandomSong)
                .next()
                .select(S.selectSongLoaded)
                .next(false)
                .select(S.selectShuffleStatus)
                .next(true)
                .call(axios.get, 'api/v1/play/random')
                .throw(new Error('some error occurred'))
                .isDone();
        });
    });
});

