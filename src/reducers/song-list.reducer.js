import { List as list, Map as map } from 'immutable';

import { formatSeconds } from '../helpers/format';
import { getNewlySelectedKeys } from '../helpers';

export const startSongListRequest = state => state
    .setIn(['songList', 'loading'], true);

export function getNewlySelectedIds(state, req) {
    // the list of selected items has to be mapped to / from IDs,
    // so that reordering the list doesn't bugger up the selection
    const selectedIds = state.getIn(['songList', 'selectedIds']);

    const songs = state.getIn(['songList', 'songs']);
    const selectedKeys = selectedIds.map(id => songs.findIndex(song => song.get('id') === id));

    const lastClickedId = state.getIn(['songList', 'lastClickedId']);
    const lastClicked = songs.findIndex(song => song.get('id') === lastClickedId);

    const newlySelectedKeys = getNewlySelectedKeys(selectedKeys, lastClicked, req);

    return newlySelectedKeys.map(key => state.getIn(['songList', 'songs', key, 'id']));
}

export const selectSongListItem = (state, req) => state
    .setIn(['songList', 'selectedIds'], getNewlySelectedIds(state, req))
    .setIn(['songList', 'lastClickedId'], state.getIn(['songList', 'songs', req.index, 'id']));

export function getNewOrderKeys(oldOrderKeys, orderKey) {
    const keyPosition = oldOrderKeys.findIndex(item => item.get('key') === orderKey);

    if (keyPosition === -1) {
        return oldOrderKeys.push(map({ key: orderKey, order: 1 }));
    }

    if (keyPosition === oldOrderKeys.size - 1) {
        return oldOrderKeys.setIn([keyPosition, 'order'], -oldOrderKeys.getIn([keyPosition, 'order']));
    }

    return list([map({ key: orderKey, order: 1 })]);
}

export function getOrderedSongList(songs, orderKeys) {
    return orderKeys.reduce((songsList, item) => songsList.sort((prev, next) => {
        const nextSorted = next.get(item.get('key')) < prev.get(item.get('key'));
        if (nextSorted) {
            return item.get('order');
        }

        const prevSorted = next.get(item.get('key')) > prev.get(item.get('key'));
        if (prevSorted) {
            return -item.get('order');
        }

        return 0;
    }), songs);
}

export const sortSongList = (state, orderKey) => {
    const oldOrderKeys = state.getIn(['songList', 'orderKeys']);
    const newOrderKeys = getNewOrderKeys(oldOrderKeys, orderKey);

    return state
        .setIn(['songList', 'songs'], getOrderedSongList(
            state.getIn(['songList', 'songs']), newOrderKeys
        ))
        .setIn(['songList', 'orderKeys'], newOrderKeys);
}

export function insertSongList(state, { err, data }) {
    let songs = list.of();

    if (!err) {
        songs = list(data).map(item => map({
            id: item[0],
            title: item[1],
            artist: item[2],
            album: item[3],
            year: item[4],
            duration: item[5],
            durationFormatted: formatSeconds(item[5]),
            track: item[6],
            trackNo: item[6] > 0
                ? item[6].toString()
                : ''
        }));
    }

    const sortedSongs = getOrderedSongList(songs, state.getIn(['songList', 'orderKeys']));

    return state
        .setIn(['songList', 'loading'], false)
        .setIn(['songList', 'songs'], sortedSongs)
        .setIn(['songList', 'menu', 'hidden'], true)
        .setIn(['songList', 'selectedIds'], list.of());
}

export function addToQueue(state, song = null) {
    let songs = list.of(song);
    if (!song) {
        const selectedIds = state.getIn(['songList', 'selectedIds']);

        songs = state
            .getIn(['songList', 'songs'])
            .filter(item => selectedIds.indexOf(item.get('id')) !== -1);
    }

    return state
        .setIn(['queue', 'songs'], state.getIn(['queue', 'songs']).concat(songs))
        .setIn(['songList', 'menu', 'hidden'], true);
}

export const orderQueue = (state, { clicked, delta }) => state
    .setIn(['queue', 'songs'], state.getIn(['queue', 'songs'])
        .set(clicked + delta, state.getIn(['queue', 'songs', clicked]))
        .set(clicked, state.getIn(['queue', 'songs', clicked + delta]))
    );

export const openMenu = (state, { posX, posY }) => state
    .setIn(['songList', 'menu'], map({ posX, posY, hidden: false }));

