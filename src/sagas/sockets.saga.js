import { eventChannel } from 'redux-saga';
import { select, fork, take, takeEvery, call, put } from 'redux-saga/effects';
import { w3cwebsocket as WebSocket } from 'websocket';
import { getWSUrl } from '../helpers';
import * as actions from '../constants/actions';
import * as socketActions from '../actions/socket.actions';

export function socketCreator(socket) {
    return eventChannel(emitter => {
        socket.onopen = () => emitter(socketActions.socketOpenedOrClosed(true));

        socket.onerror = err => emitter(socketActions.socketErrorOccurred(err));

        socket.onmessage = data => emitter(socketActions.socketStateUpdated(data));

        socket.onclose = () => emitter(socketActions.socketOpenedOrClosed(false));

        return () => {
            socket.close();
        };
    });
}

export function *socketListener(socket) {
    const channel = yield call(socketCreator, socket);

    while (true) {
        const action = yield take(channel);

        yield put(action);
    }
}

const getStateByType = type => state => JSON.stringify(state.getIn(['cloud', type]).toJS());

export const getState = {
    localState: getStateByType('localState'),
    newStates: getStateByType('newStates')
};

export const updateSocket = (socket, type) => function *updateSocketSaga() {
    if (socket.readyState !== socket.OPEN) {
        return;
    }

    const state = yield select(getState[type]);

    yield call([socket, 'send'], state);
}

export const stateListener = socket => function *stateListenerSaga() {
    const localUpdater = updateSocket(socket, 'localState');
    const remoteUpdater = updateSocket(socket, 'newStates');

    yield takeEvery(actions.AUDIO_FILE_LOADED, localUpdater);
    yield takeEvery(actions.AUDIO_TRACK_CHANGED, localUpdater);
    yield takeEvery(actions.AUDIO_PLAY_PAUSED, localUpdater);
    yield takeEvery(actions.SEARCH_SELECTED, localUpdater);

    yield takeEvery(actions.REMOTE_CLIENT_UPDATED, remoteUpdater);
}

export default function *socketSaga() {
    const wsUrl = yield call(getWSUrl, process.env.WEB_URI);
    const socket = yield call(WebSocket, wsUrl, 'echo-protocol');

    yield fork(socketListener, socket);
    yield fork(stateListener(socket));
}

