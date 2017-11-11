import { select, put, call } from 'redux-saga/effects';

import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { filterListReceived } from '../actions/filter.actions';

import { getJoinedFilter } from '../helpers';

export const selectArtistFilter = state => state.getIn(['filter', 'artist']);

export function *fetchFilterList({ payload }) {
    const { key } = payload;

    const path = [API_PREFIX, `${key}s`];

    if (key === 'album') {
        const artistFilter = yield select(selectArtistFilter);
        const selectedKeys = artistFilter.get('selectedKeys');

        if (selectedKeys.size) {
            const joinedFilter = getJoinedFilter(artistFilter, selectedKeys);

            path.push(joinedFilter);
        }
    }

    try {
        const response = yield call(axios.get, path.join('/'));

        const items = response.data;

        yield put(filterListReceived({ items, key }));
    }
    catch (err) {
        yield put(filterListReceived({ err }));
    }
}

