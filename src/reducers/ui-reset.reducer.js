export const reset = state => state
    .setIn(['songList', 'menu', 'hidden'], true);

export const loadSettings = (state, settings) => [
    ['sidebar', 'hidden'],
    ['sidebar', 'displayOver']
]
    .reduce((nextState, propArray) => {
        const key = propArray.join('_');

        if (key in settings) {
            return nextState.setIn(propArray, settings[key]);
        }

        return nextState;
    }, state);

