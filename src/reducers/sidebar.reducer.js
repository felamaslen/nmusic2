export const toggleHidden = state => state
    .setIn(['sidebar', 'hidden'], !state.getIn(['sidebar', 'hidden']));

export function toggleDisplayOver(state) {
    const wasDisplayOver = state.getIn(['sidebar', 'displayOver']);

    const displayOver = !wasDisplayOver;

    return state
        .setIn(['sidebar', 'displayOver'], displayOver)
        .setIn(['sidebar', 'hidden'], false);
}

