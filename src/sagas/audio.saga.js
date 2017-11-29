import { fromJS } from 'immutable';
import { select, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { API_PREFIX, SHUFFLE_ALL } from '../constants/misc';
import { audioFileLoaded } from '../actions/audio-player.actions';

export const selectSongLoaded = state =>
    Boolean(state.getIn(['player', 'current']));

export const selectShuffleStatus = state =>
    state.getIn(['player', 'shuffle']) === SHUFFLE_ALL;

export function *playRandomSong() {
    const songLoaded = yield select(selectSongLoaded);
    const shuffle = yield select(selectShuffleStatus);

    if (shuffle && !songLoaded) {
        try {
            const { data } = yield call(axios.get, `${API_PREFIX}/play/random`);

            const song = fromJS(data);

            yield put(audioFileLoaded(song));
        }
        catch (err) {
            // do nothing
        }
    }
}

