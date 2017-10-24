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

export const requestFilterList = (state, { key }) => state
    .setIn(['filter', key, 'loaded'], false)
    .setIn(['filter', key, 'loading'], true);

export function receiveFilterList(state, { err, items, key }) {
    const nextState = state
        .setIn(['filter', key, 'loading'], false)
        .setIn(['filter', key, 'selectedKeys'], list.of())
        .setIn(['filter', key, 'lastClickedKey'], -1);

    if (err) {
        return nextState;
    }

    const loadedState = nextState
        .setIn(['filter', key, 'loaded'], true);


    if (!items) {
        return loadedState;
    }

    return loadedState
        .setIn(['filter', key, 'items'], list(items))
}

