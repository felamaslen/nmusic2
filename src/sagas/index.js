import { takeEvery, fork } from 'redux-saga/effects';

import * as actions from '../constants/actions';

import { loadSettings } from './app.saga';
import { fetchFilterList } from './filter.saga';
import { fetchSongListWithAlbums } from './song-list.saga';
import { fetchSearchResults, selectSearchItem } from './search.saga';

export function *watchSettings() {
    yield takeEvery(actions.SETTINGS_LOADED, loadSettings);
}

export function *watchFilterListRequested() {
    yield takeEvery(actions.FILTER_LIST_REQUESTED, fetchFilterList);
}

export function *watchFilterListClicked() {
    yield takeEvery(actions.FILTER_ITEM_CLICKED, fetchSongListWithAlbums);
}

export function *watchSearchChanged() {
    yield takeEvery(actions.SEARCH_CHANGED, fetchSearchResults);
}

export function *watchSearchSelected() {
    yield takeEvery(actions.SEARCH_SELECTED, selectSearchItem);
}

export default function *rootSaga() {
    yield fork(watchSettings);

    yield fork(watchFilterListRequested);
    yield fork(watchFilterListClicked);

    yield fork(watchSearchChanged);
    yield fork(watchSearchSelected);
}

