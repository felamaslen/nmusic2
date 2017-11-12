import { call, put } from 'redux-saga/effects';
import { settingsInserted } from '../actions/ui-reset.actions';

function getSettings() {
    try {
        const item = localStorage.getItem('settings');

        const object = JSON.parse(item);

        if (object && typeof object === 'object') {
            return object;
        }
    }
    catch (err) {
        return {};
    }

    return {};
}

export function *loadSettings() {
    const settings = yield call(getSettings);

    yield put(settingsInserted(settings));
}

