import { createReducer } from 'redux-create-reducer';

import * as AC from '../constants/actions';

import * as uiReset from './ui-reset.reducer';
import * as songList from './song-list.reducer';
import * as filter from './filter.reducer';
import * as audio from './audio-player.reducer';
import * as search from './search.reducer';

import initialState from '../initialState';

function createReducerObject(array) {
    return array.reduce((obj, item) => {
        obj[item[0]] = (state, action) => item[1](state, action.payload);

        return obj;
    }, {});
}

export default createReducer(initialState, createReducerObject([
    [AC.UI_RESET, uiReset.reset],

    [AC.SONG_LIST_REQUESTED, songList.startSongListRequest],
    [AC.SONG_LIST_RETRIEVED, songList.insertSongList],
    [AC.SONG_LIST_ITEM_CLICKED, songList.selectSongListItem],
    [AC.SONG_LIST_SORTED, songList.sortSongList],
    [AC.SONG_LIST_QUEUE_ADDED, songList.addToQueue],
    [AC.SONG_LIST_MENU_OPENED, songList.openMenu],

    [AC.FILTER_LIST_REQUESTED, filter.requestFilterList],
    [AC.FILTER_LIST_RECEIVED, filter.receiveFilterList],
    [AC.FILTER_ITEM_CLICKED, filter.startFilterSongList],

    [AC.AUDIO_SOURCE_UPDATED, audio.updateAudioSource],
    [AC.AUDIO_FILE_LOADED, audio.loadAudioFile],
    [AC.AUDIO_DURATION_SET, audio.setAudioDuration],

    [AC.AUDIO_TIME_UPDATED, audio.audioTimeUpdate],
    [AC.AUDIO_BUFFERED, audio.audioProgressBuffer],
    [AC.AUDIO_ENDED, audio.handleAudioEnded],

    [AC.AUDIO_PLAY_PAUSED, audio.playPauseAudio],
    [AC.AUDIO_TRACK_CHANGED, audio.changeTrack],
    [AC.AUDIO_SEEKED, audio.audioSeek],

    [AC.SEARCH_CHANGED, search.changeSearch],
    [AC.SEARCH_NAVIGATED, search.navigateSearch],
    [AC.SEARCH_SELECTED, search.selectSearchItem],
    [AC.SEARCH_RESULTS_RECEIVED, search.handleSearchResults],
    [AC.SEARCH_FOCUS_SET, search.setFocusStatus]
]));

