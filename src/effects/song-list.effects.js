import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { songListRetrieved } from '../actions/song-list.actions';
import { filterListReceived } from '../actions/filter.actions';

import { getJoinedFilter } from '../helpers';

export async function requestSongList(dispatch, state) {
    const params = state.get('filter')
        .reduce((items, filter, filterKey) => {
            const selectedKeys = filter.get('selectedKeys');

            const loadFilter = selectedKeys.size && filter.get('loaded');
            if (loadFilter) {
                return {
                    ...items,
                    [filterKey]: getJoinedFilter(filter, selectedKeys)
                };
            }

            return items;

        }, {});

    const promises = [axios.get(`${API_PREFIX}/songs`, { params })];

    const albumsListLoaded = state.getIn(['filter', 'album', 'loaded']);
    if (!albumsListLoaded) {
        const path = [API_PREFIX, 'albums'];

        const artistsFilter = state.getIn(['filter', 'artist']);
        const selectedKeys = artistsFilter.get('selectedKeys');
        if (selectedKeys.size) {
            path.push(getJoinedFilter(artistsFilter, selectedKeys));
        }

        promises.push(axios.get(path.join('/')));
    }

    try {
        const responses = await Promise.all(promises);

        const response = responses.shift();
        dispatch(songListRetrieved({ response }));

        if (responses.length) {
            const items = responses.shift().data;
            dispatch(filterListReceived({ items, key: 'album' }));
        }
    }
    catch (err) {
        dispatch(songListRetrieved({ err }));
    }
}

