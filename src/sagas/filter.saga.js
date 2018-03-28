import { select, takeEvery, all, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { getJoinedFilter } from '../helpers';
import { API_PREFIX } from '../constants/misc';
import * as actions from '../constants/actions';
import { songListReceived } from '../actions/song-list.actions';
import { filterListReceived } from '../actions/filter.actions';

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
        const { data: items } = yield call(axios.get, path.join('/'));

        yield put(filterListReceived({ items, key }));
    }
    catch (err) {
        yield put(filterListReceived({ err }));
    }
}

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

export default function *songListSaga() {
    yield takeEvery(actions.FILTER_LIST_REQUESTED, fetchFilterList);
    yield takeEvery(actions.FILTER_ITEM_CLICKED, fetchSongListWithAlbums);
}

