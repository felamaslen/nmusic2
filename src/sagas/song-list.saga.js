import { select, put } from 'redux-saga/effects';

import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { songListReceived } from '../actions/song-list.actions';

import { getJoinedFilter } from '../helpers';

export function *fetchFilteredSongList() {
    const filter = yield select(state => state.get('filter'));

    const params = filter
        .reduce((items, filterItem, filterKey) => {
            const selectedKeys = filterItem.get('selectedKeys');

            const loadFilter = selectedKeys.size && filterItem.get('loaded');
            if (loadFilter) {
                return {
                    ...items,
                    [filterKey]: getJoinedFilter(filterItem, selectedKeys)
                };
            }

            return items;

        }, {});

    let response = null;

    if (!(params.artist && params.artist.length) && !(params.album && params.album.length)) {
        response = { data: [] };
    }
    else {
        response = yield axios.get(`${API_PREFIX}/songs`, { params });
    }

    yield put(songListReceived(response));
}

