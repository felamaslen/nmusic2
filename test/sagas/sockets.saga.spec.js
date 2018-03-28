/* eslint-disable prefer-reflect */
import { fromJS } from 'immutable';
import { expect } from 'chai';
import { testSaga } from 'redux-saga-test-plan';
import { eventChannel } from 'redux-saga';
import * as S from '../../src/sagas/sockets.saga';

describe('Sockets saga', () => {
    describe('socketListener', () => {
        it('should continually listen to the socket events', () => {
            const testChannel = eventChannel(() => () => null);

            testSaga(S.socketListener, { my: 'socket' })
                .next()
                .call(S.socketCreator, { my: 'socket' })
                .next(testChannel)
                .take(testChannel)
                .next({ type: 'some_action' })
                .put({ type: 'some_action' })
                .next()
                .take(testChannel)
                .next({ type: 'other_action' })
                .put({ type: 'other_action' })
                .next()
                .take(testChannel);
        });
    });

    describe('getState', () => {
        it('should return a stringfied client state', () => {
            const state = fromJS({
                cloud: {
                    localState: { foo: 'bar' },
                    newStates: { bar: 'baz' }
                }
            });

            expect(S.getState.localState(state))
                .to.equal('{"foo":"bar"}');

            expect(S.getState.newStates(state))
                .to.equal('{"bar":"baz"}');
        });
    });

    describe('updateSocket', () => {
        it('should do nothing if the socket is not ready', () => {
            const socket = {
                readyState: 'NOT OPEN',
                OPEN: 'OPEN'
            };

            testSaga(S.updateSocket(socket, null))
                .next()
                .isDone();
        });

        it('should get and send the current state', () => {
            const socket = {
                readyState: 'OPEN',
                OPEN: 'OPEN',
                send: () => null
            };

            testSaga(S.updateSocket(socket, 'localState'))
                .next()
                .select(S.getState.localState)
                .next('{"foo":"bar"}')
                .call([socket, 'send'], '{"foo":"bar"}')
                .next()
                .isDone();
        });
    });
});

