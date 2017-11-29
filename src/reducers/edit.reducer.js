import { Map as map } from 'immutable';
import { trackNo } from '../helpers';
import { getOrderedSongList } from './song-list.reducer';
import { getArtworkSrc } from './audio-player.reducer';

export function open(state) {
    const id = state.getIn(['songList', 'lastClickedId']);
    if (!id) {
        return state;
    }

    const song = state.getIn(['songList', 'songs'])
        .find(item => item.get('id') === id);
    if (!song) {
        return state;
    }

    return state
        .setIn(['editInfo', 'song'], song)
        .setIn(['editInfo', 'artwork'], getArtworkSrc(song))
        .setIn(['editInfo', 'newValues'], song)
        .setIn(['editInfo', 'hidden'], false)
        .setIn(['songList', 'menu', 'hidden'], true);
}

export function close(state, { cancel }) {
    if (cancel) {
        return state
            .setIn(['editInfo', 'hidden'], true);
    }

    return state
        .setIn(['editInfo', 'loading'], true);
}

export function changeEditValue(state, { key, value }) {
    return state
        .setIn(['editInfo', 'newValues', key], value);
}

export function receiveUpdatedEditValues(state, { data }) {
    const nextState = state
        .setIn(['editInfo', 'loading'], false)
        .setIn(['editInfo', 'song'], null)
        .setIn(['editInfo', 'newValues'], map.of())
        .setIn(['editInfo', 'hidden'], true);

    if (!(data && data.success)) {
        return nextState;
    }

    const updated = state
        .getIn(['editInfo', 'newValues'])
        .set('trackNo', trackNo(state.getIn(['editInfo', 'newValues', 'track'])));

    const newSongs = state.getIn(['songList', 'songs'])
        .map(song => {
            if (song.get('id') === updated.get('id')) {
                return song.mergeDeep(updated);
            }

            return song;
        });

    return nextState
        .setIn(['songList', 'songs'], getOrderedSongList(nextState, newSongs));
}

