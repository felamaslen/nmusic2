import { fromJS } from 'immutable';
import { select, takeEvery, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { API_PREFIX, SHUFFLE_ALL } from '../constants/misc';
import * as actions from '../constants/actions';
import { audioFileLoaded } from '../actions/audio-player.actions';
import { setSettings } from './app.saga';

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

export function *rememberVolume({ payload }) {
    const { remember } = payload;

    if (!remember) {
        return;
    }

    yield call(setSettings, 'player_volume');
}

export default function *audioSaga() {
    yield takeEvery(actions.AUDIO_VOLUME_SET, rememberVolume);
    yield takeEvery(actions.AUDIO_PLAY_PAUSED, playRandomSong);
    yield takeEvery(actions.AUDIO_TRACK_CHANGED, playRandomSong);
}

