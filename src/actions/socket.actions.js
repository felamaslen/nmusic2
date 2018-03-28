import buildAction from '../messageBuilder';
import * as actions from '../constants/actions';

export const socketOpenedOrClosed = status => buildAction(actions.SOCKET_OPENED_CLOSED, status);

export const socketErrorOccurred = err => buildAction(actions.SOCKET_ERROR_OCCURRED, err);

export const socketStateUpdated = data => buildAction(actions.SOCKET_STATE_UPDATED, data);

export const remoteClientUpdated = req => buildAction(actions.REMOTE_CLIENT_UPDATED, req);

