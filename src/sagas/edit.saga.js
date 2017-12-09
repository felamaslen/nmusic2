import { select, call, put } from 'redux-saga/effects';
import { API_PREFIX } from '../constants/misc';
import { editInfoClosed, editInfoValuesUpdated } from '../actions/edit-info.actions';
import axios from 'axios';

export const selectEditValues = state => ({
    ids: state
        .getIn(['editInfo', 'songs'])
        .map(song => song.get('id'))
        .toJS(),
    fields: state
        .getIn(['editInfo', 'newValues'])
        .filter(item => item.get('active'))
        .map(item => item.get('value'))
        .toJS()
});

export function *updateSongInfo({ payload }) {
    const { cancel } = payload;

    if (cancel) {
        return;
    }

    const { ids, fields } = yield select(selectEditValues);

    const fieldTypes = {
        track: 'number',
        artist: 'string',
        album: 'string',
        title: 'string'
    };

    const data = {
        ids,
        ...Object.keys(fieldTypes)
            .reduce((next, key) => {
                if (!(key in fields)) {
                    return next;
                }

                const type = fieldTypes[key];

                if (type === 'number') {
                    return { ...next, [key]: Number(fields[key]) };
                }

                return { ...next, [key]: String(fields[key]) };

            }, {})
    };

    try {
        const response = yield call(axios.patch, `${API_PREFIX}/edit`, data);

        yield put(editInfoValuesUpdated(response));
    }
    catch (err) {
        yield put(editInfoClosed(true));
    }
}

