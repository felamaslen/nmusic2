import { takeEvery, fork } from 'redux-saga/effects';

import * as actions from '../constants/actions';

import * as app from './app.saga';
import * as filter from './filter.saga';
import * as songList from './song-list.saga';
import * as search from './search.saga';

export function *watchSettings() {
    yield takeEvery(actions.SETTINGS_LOADED, app.loadSettings);

    yield takeEvery(actions.SIDEBAR_HIDDEN, app.setSettings, 'sidebar_hidden');
    yield takeEvery(actions.SIDEBAR_DISPLAY_OVER_TOGGLED, app.setSettings, 'sidebar_displayOver');
}

export function *watchFilterListRequested() {
    yield takeEvery(actions.FILTER_LIST_REQUESTED, filter.fetchFilterList);
}

export function *watchFilterListClicked() {
    yield takeEvery(actions.FILTER_ITEM_CLICKED, songList.fetchSongListWithAlbums);
}

export function *watchSearchChanged() {
    yield takeEvery(actions.SEARCH_CHANGED, search.fetchSearchResults);
}

export function *watchSearchSelected() {
    yield takeEvery(actions.SEARCH_SELECTED, search.selectSearchItem);
}

export default function *rootSaga() {
    yield fork(watchSettings);

    yield fork(watchFilterListRequested);
    yield fork(watchFilterListClicked);

    yield fork(watchSearchChanged);
    yield fork(watchSearchSelected);
}

