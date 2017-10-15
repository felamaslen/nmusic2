import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { filterListReceived } from '../actions/filter.actions';

import { getJoinedFilter } from '../helpers';

export async function requestFilterList(dispatch, state, { key }) {
    const path = [API_PREFIX, `${key}s`];

    if (key === 'album') {
        const artistFilter = state.getIn(['filter', 'artist']);
        const selectedKeys = artistFilter.get('selectedKeys');

        if (selectedKeys.size) {
            const joinedFilter = getJoinedFilter(artistFilter, selectedKeys);

            path.push(joinedFilter);
        }
    }

    try {
        const response = await axios.get(path.join('/'));

        const items = response.data;

        dispatch(filterListReceived({ items, key }));
    }
    catch (err) {
        dispatch(filterListReceived({ err }));
    }
}

