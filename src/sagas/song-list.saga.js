/*
import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { songListRetrieved } from '../actions/song-list.actions';
import { filterListReceived } from '../actions/filter.actions';

import { getJoinedFilter } from '../helpers';
*/

export function requestSongList() {
    return new Promise(resolve => {
        setTimeout(() => resolve('foo'), 2000);
    });

    /*
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

    const getSongsPromise = filterParams => {
        if (!(params.artist && params.artist.length) && !(params.album && params.album.length)) {
            return Promise.resolve({ data: [] });
        }

        return axios.get(`${API_PREFIX}/songs`, { params: filterParams });
    }

    const promises = [getSongsPromise(params)];

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

    return Promise.all(promises);

    // */
}

