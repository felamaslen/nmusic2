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

export function getNewlySelectedKeys(currentlySelected, lastClicked, { index, shift, ctrl }) {
    if (shift) {
        // select a range
        if (lastClicked === -1) {
            return list([index]);
        }

        if (lastClicked === index) {
            return currentlySelected;
        }

        const minItem = Math.min(index, lastClicked);
        const numItems = 1 + Math.abs(lastClicked - index);

        const newItems = list(new Array(numItems).fill(0))
            .map((item, key) => minItem + key)
            .filter(item => currentlySelected.indexOf(item) === -1);

        return currentlySelected.concat(newItems);
    }

    if (ctrl) {
        const selectedIndex = currentlySelected.indexOf(index);

        if (selectedIndex !== -1) {
            return currentlySelected.delete(selectedIndex);
        }

        return currentlySelected.push(index);
    }

    return list([index]);
}

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

