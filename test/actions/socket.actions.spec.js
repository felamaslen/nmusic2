import { expect } from 'chai';
import * as actions from '../../src/constants/actions';
import * as socket from '../../src/actions/socket.actions';

describe('Socket actions', () => {
    describe('socketOpenedOrClosed', () => {
        it('should return SOCKET_OPENED_CLOSED with status', () => {
            expect(socket.socketOpenedOrClosed(true))
                .to.deep.equal({ type: actions.SOCKET_OPENED_CLOSED, payload: true });

            expect(socket.socketOpenedOrClosed(false))
                .to.deep.equal({ type: actions.SOCKET_OPENED_CLOSED, payload: false });
        });
    });

    describe('socketErrorOccurred', () => {
        it('should return SOCKET_ERROR_OCCURRED with an error object', () => {
            expect(socket.socketErrorOccurred('test error'))
                .to.deep.equal({ type: actions.SOCKET_ERROR_OCCURRED, payload: 'test error' });
        });
    });

    describe('socketStateUpdated', () => {
        it('should return SOCKET_STATE_UPDATED with data', () => {
            expect(socket.socketStateUpdated({ foo: 'bar' })).to.deep.equal({
                type: actions.SOCKET_STATE_UPDATED, payload: { foo: 'bar' }
            });
        });
    });

    describe('remoteClientUpdated', () => {
        it('should return REMOTE_CLIENT_UPDATED with request', () => {
            expect(socket.remoteClientUpdated({ foo: 'bar' })).to.deep.equal({
                type: actions.REMOTE_CLIENT_UPDATED, payload: { foo: 'bar' }
            });
        });
    });
});

