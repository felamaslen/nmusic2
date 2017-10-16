import axios from 'axios';

import { API_PREFIX } from '../constants/misc';

import { searchResultsReceived } from '../actions/search.actions';
import { songListRetrieved } from '../actions/song-list.actions';

export async function requestSearchResults(dispatch, state, searchTerm) {
    if (!searchTerm.length || searchTerm === state.getIn(['search', 'term'])) {
        return;
    }

    try {
        const response = await axios.get(`${API_PREFIX}/search/${searchTerm}`);

        dispatch(searchResultsReceived({ response, searchTerm }));
    }
    catch (err) {
        dispatch(searchResultsReceived({ err }));
    }
}

export async function requestSearchedSongList(dispatch, state) {
    let noTerm = true;

    const params = ['artist', 'album']
        .reduce((filter, key) => {
            const term = state.getIn(['search', `${key}Search`]);

            if (term) {
                filter[key] = term;

                noTerm = false;
            }

            return filter;
        }, {});

    if (noTerm) {
        return;
    }

    try {
        const response = await axios.get(`${API_PREFIX}/songs`, { params });

        dispatch(songListRetrieved({ response }));
    }
    catch (err) {
        dispatch(songListRetrieved({ err }));
    }
}

