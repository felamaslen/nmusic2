import { createReducer } from 'redux-create-reducer';

import * as AC from '../constants/actions';

import {
    startSongListRequest, insertSongList, selectSongListItem,
    sortSongList
} from './song-list.reducer';

import {
    receiveFilterList,
    startFilterSongList
} from './filter.reducer';

import {
    loadAudioFile, setAudioDuration,
    audioTimeUpdate, audioProgressBuffer, handleAudioEnded,
    playPauseAudio, changeTrack, audioSeek,
    updateAudioSource,
    setArtworkLoaded
} from './audio-player.reducer';

import initialState from '../initialState';

function createReducerObject(array) {
    return array.reduce((obj, item) => {
        obj[item[0]] = (state, action) => item[1](state, action.payload);

        return obj;
    }, {});
}

export default createReducer(initialState, createReducerObject([
    [AC.SONG_LIST_REQUESTED, startSongListRequest],
    [AC.SONG_LIST_RETRIEVED, insertSongList],
    [AC.SONG_LIST_ITEM_CLICKED, selectSongListItem],
    [AC.SONG_LIST_SORTED, sortSongList],

    [AC.FILTER_LIST_LOADED, receiveFilterList],
    [AC.FILTER_ITEM_CLICKED, startFilterSongList],

    [AC.AUDIO_SOURCE_UPDATED, updateAudioSource],
    [AC.AUDIO_FILE_LOADED, loadAudioFile],
    [AC.AUDIO_DURATION_SET, setAudioDuration],

    [AC.AUDIO_TIME_UPDATED, audioTimeUpdate],
    [AC.AUDIO_BUFFERED, audioProgressBuffer],
    [AC.AUDIO_ENDED, handleAudioEnded],

    [AC.AUDIO_PLAY_PAUSED, playPauseAudio],
    [AC.AUDIO_TRACK_CHANGED, changeTrack],
    [AC.AUDIO_SEEKED, audioSeek],

    [AC.ARTWORK_LOADED, setArtworkLoaded]
]));

