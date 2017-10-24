import axios from 'axios';

import { select, put } from 'redux-saga/effects';

import { API_PREFIX } from '../constants/misc';

import { searchResultsReceived } from '../actions/search.actions';
import { songListReceived } from '../actions/song-list.actions';

export function *fetchSearchResults({ payload }) {
    const searchTerm = payload;
    const currentSearchTerm = yield select(state => state.getIn(['search', 'term']));

    if (!searchTerm.length || searchTerm === currentSearchTerm) {
        return;
    }

    try {
        const response = yield axios.get(`${API_PREFIX}/search/${searchTerm}`);

        yield put(searchResultsReceived({ response, searchTerm }));
    }
    catch (err) {
        yield put(searchResultsReceived({ err }));
    }
}

export function *selectSearchItem() {
    let noTerm = true;

    const search = yield select(state => state.get('search'));
    const songListLoading = yield select(state => state.getIn(['songList', 'loading']));

    const params = ['artist', 'album']
        .reduce((filter, key) => {
            const term = search.get(`${key}Search`);

            if (term) {
                filter[key] = term;

                noTerm = false;
            }

            return filter;
        }, {});

    if (noTerm || !songListLoading) {
        return;
    }

    try {
        const response = yield axios.get(`${API_PREFIX}/songs`, { params });

        yield put(songListReceived({ data: response.data }));
    }
    catch (err) {
        yield put(songListReceived({ err }));
    }
}

