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

