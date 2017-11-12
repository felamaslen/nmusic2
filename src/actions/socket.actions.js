import buildAction from '../messageBuilder';
import { SOCKET_ERROR_OCCURRED, SOCKET_STATE_UPDATED } from '../constants/actions';

export const socketErrorOccurred = err => buildAction(SOCKET_ERROR_OCCURRED, err);

export const socketStateUpdated = data => buildAction(SOCKET_STATE_UPDATED, data);

