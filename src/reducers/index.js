import { createReducer } from 'redux-create-reducer';

import * as AC from '../constants/actions';

import {
    startSongListRequest, insertSongList, selectSongListItem,
    sortSongList
} from './song-list.reducer';

import {
    loadAudioFile, setAudioDuration, handleAudioEnded,
    playPauseAudio, audioSeek, audioTimeUpdate, updateAudioAnalyser
} from './audio-player.reducer';

import initialState from '../initialState';

import analyserState from '../analyserState';

function createReducerObject(array) {
    return array.reduce((obj, item) => {
        obj[item[0]] = (state, action) => item[1](state, action.payload);

        return obj;
    }, {});
}

export const analyserReducer = createReducer(analyserState, createReducerObject([
    [AC.AUDIO_ANALYSER_UPDATED, updateAudioAnalyser]
]));

export default createReducer(initialState, createReducerObject([
    [AC.SONG_LIST_REQUESTED, startSongListRequest],
    [AC.SONG_LIST_RETRIEVED, insertSongList],
    [AC.SONG_LIST_ITEM_CLICKED, selectSongListItem],
    [AC.SONG_LIST_SORTED, sortSongList],

    [AC.AUDIO_FILE_LOADED, loadAudioFile],
    [AC.AUDIO_DURATION_SET, setAudioDuration],
    [AC.AUDIO_ENDED, handleAudioEnded],
    [AC.AUDIO_PLAY_PAUSED, playPauseAudio],
    [AC.AUDIO_SEEKED, audioSeek],
    [AC.AUDIO_TIME_UPDATED, audioTimeUpdate]
]));

