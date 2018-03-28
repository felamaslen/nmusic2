import { select, takeEvery, call, put } from 'redux-saga/effects';
import { settingsInserted } from '../actions/ui-reset.actions';
import * as actions from '../constants/actions';
import { PERSISTENT_SETTINGS, keyFromStore } from '../constants/settings';

const getSettings = () => PERSISTENT_SETTINGS.reduce((object, storeKey) => {
    const settingsKey = keyFromStore(storeKey);

    try {
        if (Reflect.apply(Object.prototype.hasOwnProperty, localStorage, [settingsKey])) {
            const value = JSON.parse(localStorage.getItem(settingsKey));

            return { ...object, [settingsKey]: value };
        }
    }
    catch (err) {
        return object;
    }

    return object;

}, {});

export function *loadSettings() {
    const settings = yield call(getSettings);

    yield put(settingsInserted(settings));
}

const selectSetting = key => state => state.getIn(key.split('_'));

export function *setSettings(key) {
    const value = yield select(selectSetting(key));

    try {
        yield call([localStorage, 'setItem'], key, value);
    }
    catch (err) {
        // do nothing
    }
}

export default function *appSaga() {
    yield takeEvery(actions.SETTINGS_LOADED, loadSettings);

    yield takeEvery(actions.SIDEBAR_HIDDEN, setSettings, 'sidebar_hidden');
    yield takeEvery(actions.SIDEBAR_DISPLAY_OVER_TOGGLED, setSettings, 'sidebar_displayOver');
}

