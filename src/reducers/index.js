import { createReducer } from 'redux-create-reducer';

import * as AC from '../constants/actions';

import {
    startSongListRequest, insertSongList, selectSongListItem
} from './song-list.reducer';

import {
    loadAudioFile, setAudioDuration, handleAudioEnded,
    playPauseAudio, audioSeek, audioTimeUpdate
} from './audio-player.reducer';

import initialState from '../initialState';

function createReducerObject(array) {
    return array.reduce((obj, item) => {
        obj[item[0]] = (state, action) => item[1](state, action.payload);

        return obj;
    }, {});
}

const reducers = createReducerObject([
    [AC.SONG_LIST_REQUESTED, startSongListRequest],
    [AC.SONG_LIST_RETRIEVED, insertSongList],
    [AC.SONG_LIST_ITEM_CLICKED, selectSongListItem],

    [AC.AUDIO_FILE_LOADED, loadAudioFile],
    [AC.AUDIO_DURATION_SET, setAudioDuration],
    [AC.AUDIO_ENDED, handleAudioEnded],
    [AC.AUDIO_PLAY_PAUSED, playPauseAudio],
    [AC.AUDIO_SEEKED, audioSeek],
    [AC.AUDIO_TIME_UPDATED, audioTimeUpdate]
]);

export default createReducer(initialState, reducers);

