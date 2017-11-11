import { all, select, put, call } from 'redux-saga/effects';

import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { songListReceived } from '../actions/song-list.actions';
import { fetchFilterList } from './filter.saga';

import { getJoinedFilter } from '../helpers';

export const selectFilter = state => state.get('filter');

export function *fetchFilteredSongList() {
    const filter = yield select(selectFilter);

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

    if (!(params.artist && params.artist.length) && !(params.album && params.album.length)) {
        yield put(songListReceived({ data: [] }));
    }
    else {
        try {
            const { data } = yield call(axios.get, `${API_PREFIX}/songs`, { params });

            yield put(songListReceived({ data }));
        }
        catch (err) {
            yield put(songListReceived({ err }));
        }
    }
}

export const selectFilterLoaded = state => state.getIn(['filter', 'album', 'loaded']);

export function *fetchSongListWithAlbums(req) {
    const tasks = [call(fetchFilteredSongList, req)];

    const albumsLoaded = yield select(selectFilterLoaded);

    if (!albumsLoaded) {
        tasks.push(call(fetchFilterList, { payload: { key: 'album' } }));
    }

    yield all(tasks);
}

