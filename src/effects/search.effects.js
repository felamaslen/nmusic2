import axios from 'axios';

import { API_PREFIX } from '../constants/misc';

import { searchResultsReceived } from '../actions/search.actions';

export async function requestSearchResults(dispatch, state, searchTerm) {
    if (!searchTerm.length) {
        return;
    }

    try {
        const response = await axios.get(`${API_PREFIX}/search/${searchTerm}`);

        dispatch(searchResultsReceived(response.data));
    }
    catch (err) {
        dispatch(searchResultsReceived(null));
    }
}

