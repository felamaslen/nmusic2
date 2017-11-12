import { PERSISTENT_SETTINGS, keyFromStore } from '../constants/settings';

export const reset = state => state
    .setIn(['songList', 'menu', 'hidden'], true);

export const loadSettings = (state, settings) => PERSISTENT_SETTINGS
    .reduce((nextState, storeKey) => {
        const key = keyFromStore(storeKey);

        if (key in settings) {
            return nextState.setIn(storeKey, settings[key]);
        }

        return nextState;
    }, state.set('settingsLoaded', true));

