import { takeEvery, fork, call, all, select } from 'redux-saga/effects';

import * as actions from '../constants/actions';

import { fetchFilterList } from './filter.saga';
import { fetchFilteredSongList } from './song-list.saga';
import { fetchSearchResults, selectSearchItem } from './search.saga';

export function *watchFilterListRequested() {
    yield takeEvery(actions.FILTER_LIST_REQUESTED, fetchFilterList);
}

export function *fetchSongListWithAlbums(req) {
    const tasks = [call(fetchFilteredSongList, req)];

    const albumsLoaded = yield select(state => state.getIn(['filter', 'album', 'loaded']));
    if (!albumsLoaded) {
        tasks.push(call(fetchFilterList, { payload: { key: 'album' } }));
    }

    yield all(tasks);
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
    yield fork(watchFilterListRequested);
    yield fork(watchFilterListClicked);

    yield fork(watchSearchChanged);
    yield fork(watchSearchSelected);
}

