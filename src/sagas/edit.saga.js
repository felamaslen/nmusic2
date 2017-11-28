import { select, call, put } from 'redux-saga/effects';
import { API_PREFIX } from '../constants/misc';
import { editInfoClosed, editInfoValuesUpdated } from '../actions/edit-info.actions';
import axios from 'axios';

export const selectEditValues = state => ({
    id: state.getIn(['editInfo', 'song', 'id']),
    ...state.getIn(['editInfo', 'newValues'])
        .toJS()
});

export function *updateSongInfo({ payload }) {
    const { cancel } = payload;

    if (cancel) {
        return;
    }

    const { id, ...fields } = yield select(selectEditValues);

    const { artist, album, title } = fields;

    try {
        const response = yield call(axios.patch, `${API_PREFIX}/edit/${id}`, { artist, album, title });

        yield put(editInfoValuesUpdated(response));
    }
    catch (err) {
        yield put(editInfoClosed(true));
    }
}

