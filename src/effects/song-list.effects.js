import axios from 'axios';

import { API_PREFIX } from '../constants/misc';
import { songListRetrieved } from '../actions/song-list.actions';

export async function requestSongList(dispatch) {
    try {
        const response = await axios.get(`${API_PREFIX}songs`);

        dispatch(songListRetrieved({ response }));
    }
    catch (err) {
        dispatch(songListRetrieved({ err }));
    }
}

