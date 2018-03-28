import { fork } from 'redux-saga/effects';

import appSaga from './app.saga';
import filterSaga from './filter.saga';
import searchSaga from './search.saga';
import audioSaga from './audio.saga';
import editSaga from './edit.saga';

export default function *rootSaga() {
    yield fork(appSaga);
    yield fork(filterSaga);
    yield fork(searchSaga);
    yield fork(audioSaga);
    yield fork(editSaga);
}

