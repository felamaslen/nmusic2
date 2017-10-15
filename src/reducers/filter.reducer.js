import { List as list } from 'immutable';

import { getNewlySelectedKeys } from '../helpers';

export function startFilterSongList(state, { filterKey, index, ...evt }) {
    const lastClicked = state.getIn(['filter', filterKey, 'lastClickedKey']);
    const selectedKeys = state.getIn(['filter', filterKey, 'selectedKeys']);

    const newlySelectedKeys = getNewlySelectedKeys(selectedKeys, lastClicked, { index, ...evt });

    const albumsListLoaded = state.getIn(['filter', 'album', 'loaded']) &&
        !(filterKey === 'artist' && !selectedKeys.equals(newlySelectedKeys));

    return state
        .setIn(['filter', filterKey, 'lastClickedKey'], index)
        .setIn(['filter', filterKey, 'selectedKeys'], newlySelectedKeys)
        .setIn(['filter', 'album', 'loaded'], albumsListLoaded);
}

export function receiveFilterList(state, { err, items, key }) {
    const loadedState = state
        .setIn(['filter', key, 'loaded'], true)
        .setIn(['filter', key, 'selectedKeys'], list.of())
        .setIn(['filter', key, 'lastClickedKey'], -1);

    if (err) {
        return loadedState;
    }

    if (!items) {
        return state;
    }

    return loadedState
        .setIn(['filter', key, 'items'], list(items))
}

