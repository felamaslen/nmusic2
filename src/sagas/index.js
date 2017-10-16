import { take, takeEvery, put, all } from 'redux-saga/effects';

import * as actions from '../constants/actions';

import { requestSongList } from './song-list.saga';
import { requestFilterList } from './filter.saga';

import { songListRetrieved } from '../actions/song-list.actions';
import { filterListReceived } from '../actions/filter.actions';

export function *fetchSongList() {
    const response = yield requestSongList();

    yield put(songListRetrieved(response));
}

export function *fetchFilterList() {
    const response = yield requestFilterList();

    yield put(filterListReceived(response));
}

export function *watchSongListRequested() {
    yield take(actions.SONG_LIST_REQUESTED, fetchSongList);
}

export function *watchFilterListRequested() {
    yield takeEvery(actions.FILTER_LIST_LOADED, fetchFilterList);
}

export default function *rootSaga() {
    yield all([
        watchSongListRequested(),
        watchFilterListRequested()
    ]);
}

