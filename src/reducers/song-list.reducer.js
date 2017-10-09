import { List as list, Map as map } from 'immutable';

import { formatSeconds } from './format.common';

export const startSongListRequest = state => state
    .setIn(['songList', 'loading'], true);

export function insertSongList(state, { err, response }) {
    let songs = list.of();

    if (!err) {
        songs = list(response.data).map(item => map({
            id: item[0],
            title: item[1],
            artist: item[2],
            album: item[3],
            year: item[4],
            duration: item[5],
            durationFormatted: formatSeconds(item[5])
        }));
    }

    return state
        .setIn(['songList', 'loading'], false)
        .setIn(['songList', 'songs'], songs);
}

