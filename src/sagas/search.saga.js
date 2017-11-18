import axios from 'axios';

import { select, put, call } from 'redux-saga/effects';

import { API_PREFIX } from '../constants/misc';

import { searchResultsReceived } from '../actions/search.actions';
import { songListReceived } from '../actions/song-list.actions';
import { filterItemClicked } from '../actions/filter.actions';

import { selectArtistFilter } from './filter.saga';

export const selectSearchTerm = state => state.getIn(['search', 'term']);

export function *fetchSearchResults({ payload }) {
    const searchTerm = payload;
    const currentSearchTerm = yield select(selectSearchTerm);

    if (!(searchTerm.length && searchTerm !== currentSearchTerm)) {
        return;
    }

    try {
        const response = yield call(axios.get, `${API_PREFIX}/search/${searchTerm}`);

        yield put(searchResultsReceived({ response, searchTerm }));
    }
    catch (err) {
        yield put(searchResultsReceived({ err }));
    }
}

export const selectSearch = state => state.get('search');

export const selectSongListLoading = state => state.getIn(['songList', 'loading']);

export function *selectSearchItem() {
    let noTerm = true;

    const search = yield select(selectSearch);
    const songListLoading = yield select(selectSongListLoading);

    const params = ['artist', 'album']
        .reduce((filter, key) => {
            const term = search.get(`${key}Search`);

            if (term) {
                filter[key] = term;

                noTerm = false;
            }

            return filter;
        }, {});

    const artistSearch = search.get('artistSearch');
    if (artistSearch) {
        const artistFilter = yield select(selectArtistFilter);

        const index = artistFilter.get('items')
            .findIndex(filterItem => filterItem === artistSearch);

        if (index > -1) {
            yield put(filterItemClicked({
                filterKey: 'artist',
                index
            }));

            return;
        }
    }

    if (noTerm || !songListLoading) {
        return;
    }

    try {
        const response = yield call(axios.get, `${API_PREFIX}/songs`, { params });

        yield put(songListReceived({ data: response.data }));
    }
    catch (err) {
        yield put(songListReceived({ err }));
    }
}

