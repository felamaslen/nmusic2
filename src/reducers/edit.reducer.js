import { Map as map, List as list } from 'immutable';
import { trackNo } from '../helpers';
import { getOrderedSongList } from './song-list.reducer';
import { getArtworkSrc } from './audio-player.reducer';
import { EDIT_KEYS } from '../constants/misc';

export function open(state, selectedIds = state.getIn(['songList', 'selectedIds'])) {
    const songs = state.getIn(['songList', 'songs'])
        .filter(song => selectedIds.includes(song.get('id')));

    if (!songs.size) {
        return state;
    }

    const newValues = list(EDIT_KEYS).reduce((items, key) => items.set(key, map({
        active: songs.every(song => song.get(key) === songs.getIn([0, key])),
        value: songs.getIn([0, key])
    })), map.of());

    const selectedIndex = state.getIn(['songList', 'songs'])
        .findIndex(song => song.get('id') === selectedIds.first());

    const prevAvailable = selectedIds.size === 1 && selectedIndex > 0;
    const nextAvailable = selectedIds.size === 1 &&
        selectedIndex < state.getIn(['songList', 'songs']).size - 1;

    return state
        .setIn(['editInfo', 'songs'], songs)
        .setIn(['editInfo', 'artwork'], getArtworkSrc(songs.first()))
        .setIn(['editInfo', 'newValues'], newValues)
        .setIn(['editInfo', 'hidden'], false)
        .setIn(['editInfo', 'prevAvailable'], prevAvailable)
        .setIn(['editInfo', 'nextAvailable'], nextAvailable)
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

export function navigate(state, { direction }) {
    const editOpen = state.getIn(['editInfo', 'songs']).size === 1;
    if (!editOpen) {
        return state;
    }

    const songs = state.getIn(['songList', 'songs']);
    const currentIndex = songs
        .findIndex(song => song.get('id') === state
            .getIn(['editInfo', 'songs', 0, 'id'])
        );

    const nextIndex = currentIndex + direction;

    if (currentIndex === -1 || nextIndex < 0 || nextIndex > songs.size - 1) {
        return state;
    }

    const selectedIds = list.of(songs.getIn([nextIndex, 'id']));

    return open(state, selectedIds);
}

export function changeEditValue(state, { key, value }) {
    return state
        .setIn(['editInfo', 'newValues', key, 'value'], value);
}

export function receiveUpdatedEditValues(state, { data }) {
    const nextState = state
        .setIn(['editInfo', 'loading'], false)
        .setIn(['editInfo', 'songs'], null)
        .setIn(['editInfo', 'newValues'], map.of())
        .setIn(['editInfo', 'hidden'], true);

    if (!(data && data.success)) {
        return nextState;
    }

    const updatedValues = state
        .getIn(['editInfo', 'newValues'])
        .filter(item => item.get('active'))
        .map(item => item.get('value'));

    const updated = state
        .getIn(['editInfo', 'songs'])
        .reduce((items, song) => {
            let updatedTrackNo = song.get('trackNo');
            if (updatedValues.has('track')) {
                updatedTrackNo = trackNo(updatedValues.get('track'));
            }

            return items.set(song.get('id'), song
                .mergeDeep(updatedValues)
                .set('trackNo', updatedTrackNo)
            );

        }, map.of());

    const newSongs = state.getIn(['songList', 'songs'])
        .map(song => {
            if (updated.has(song.get('id'))) {
                return updated.get(song.get('id'));
            }

            return song;
        });

    return nextState
        .setIn(['songList', 'songs'], getOrderedSongList(nextState, newSongs));
}

