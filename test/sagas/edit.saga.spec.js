/* eslint-disable prefer-reflect */
import { fromJS } from 'immutable';
import { expect } from 'chai';
import { testSaga } from 'redux-saga-test-plan';
import axios from 'axios';
import * as saga from '../../src/sagas/edit.saga';
import * as actions from '../../src/actions/edit-info.actions';

describe('Edit saga', () => {
    describe('selectEditValues', () => {
        it('should get the right values from the state', () => {
            expect(saga.selectEditValues(fromJS({
                editInfo: {
                    songs: [
                        { id: '19123' },
                        { id: '1833' }
                    ],
                    newValues: {
                        track: { active: true, value: 10 },
                        title: { active: false, value: 'foo' },
                        artist: { active: true, value: 'bar' },
                        album: { active: true, value: 'baz' }
                    }
                }
            }))).to.deep.equal({
                ids: ['19123', '1833'],
                fields: {
                    track: 10,
                    artist: 'bar',
                    album: 'baz'
                }
            });
        });
    });

    describe('updateSongInfo', () => {
        it('should do nothing if cancelling', () => {
            testSaga(saga.updateSongInfo, { payload: { cancel: true } })
                .next()
                .isDone();
        });

        it('should call the API to update song info otherwise', () => {
            testSaga(saga.updateSongInfo, { payload: { cancel: false } })
                .next()
                .select(saga.selectEditValues)
                .next({
                    ids: ['19123', '1833'],
                    fields: {
                        track: 10,
                        artist: 'bar',
                        album: 'baz'
                    }
                })
                .call(axios.patch, 'api/v1/edit', {
                    ids: ['19123', '1833'],
                    track: 10,
                    artist: 'bar',
                    album: 'baz'
                })
                .next({ data: { success: true } })
                .put(actions.editInfoValuesUpdated({ data: { success: true } }))
                .next()
                .isDone();
        });

        it('should handle errors', () => {
            testSaga(saga.updateSongInfo, { payload: { cancel: false } })
                .next()
                .select(saga.selectEditValues)
                .next({
                    ids: ['19123', '1833'],
                    fields: {
                        track: 10,
                        artist: 'bar',
                        album: 'baz'
                    }
                })
                .call(axios.patch, 'api/v1/edit', {
                    ids: ['19123', '1833'],
                    track: 10,
                    artist: 'bar',
                    album: 'baz'
                })
                .throw(new Error('some error occurred'))
                .put(actions.editInfoClosed(true))
                .next()
                .isDone();
        });
    });
});

