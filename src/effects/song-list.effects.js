import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { songListRetrieved } from '../actions/song-list.actions';

import { getJoinedFilter } from '../helpers';

export async function requestSongList(dispatch, state) {
    const params = state.get('filter')
        .reduce((items, filter, filterKey) => {
            const selectedKeys = filter.get('selectedKeys');

            if (selectedKeys.size) {
                return {
                    ...items,
                    [filterKey]: getJoinedFilter(filter, selectedKeys)
                };
            }

            return items;

        }, {});

    try {
        const response = await axios.get(`${API_PREFIX}/songs`, { params });

        dispatch(songListRetrieved({ response }));
    }
    catch (err) {
        dispatch(songListRetrieved({ err }));
    }
}

