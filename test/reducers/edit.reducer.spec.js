/* eslint-disable no-undefined */
import { fromJS } from 'immutable';
import { expect } from 'chai';
import * as R from '../../src/reducers/edit.reducer';

describe('Edit reducer', () => {
    describe('open', () => {
        it('should do nothing if there are no selected ids', () => {
            const stateNoneSelected = {
                songList: {
                    selectedIds: [],
                    songs: []
                }
            };

            expect(R.open(fromJS(stateNoneSelected)).toJS())
                .to.deep.equal(stateNoneSelected);
        });

        it('should do nothing if there is no song matching the clicked id', () => {
            const state = {
                songList: {
                    selectedIds: ['foo'],
                    songs: [
                        {
                            id: 'bar',
                            baz: 'bak'
                        }
                    ]
                }
            };

            expect(R.open(fromJS(state)).toJS()).to.deep.equal(state);
        });

        describe('for valid states', () => {
            const prevState = {
                songList: {
                    selectedIds: ['foo'],
                    songs: [
                        {
                            id: 'foo',
                            artist: 'f1',
                            album: 'f2'
                        },
                        {
                            id: 'bar',
                            artist: 'no'
                        }
                    ]
                },
                editInfo: {}
            };

            const nextState = R.open(fromJS(prevState)).toJS();

            it('should set the correct info in the editInfo map', () => {
                expect(nextState.editInfo.songs).to.deep.equal([{
                    id: 'foo',
                    artist: 'f1',
                    album: 'f2'
                }]);
                expect(nextState.editInfo.newValues).to.deep.equal({
                    artist: { active: true, value: 'f1' },
                    album: { active: true, value: 'f2' },
                    title: { active: true, value: undefined },
                    track: { active: true, value: undefined }
                });
            });

            it('should unhide the edit window', () => {
                expect(nextState.editInfo.hidden).to.equal(false);
            });

            it('should hide the context menu', () => {
                expect(nextState.songList.menu.hidden).to.equal(true);
            });
        });

        describe('if editing multiple songs', () => {
            const prevState = {
                songList: {
                    selectedIds: ['foo', 'bar'],
                    songs: [
                        {
                            id: 'foo',
                            artist: 'f1',
                            album: 'f2'
                        },
                        {
                            id: 'bar',
                            artist: 'not f1',
                            album: 'f2'
                        }
                    ]
                },
                editInfo: {}
            };

            const nextState = R.open(fromJS(prevState)).toJS();

            it('should set fields to inactive if their values differ', () => {
                expect(nextState.editInfo.songs).to.deep.equal([
                    {
                        id: 'foo',
                        artist: 'f1',
                        album: 'f2'
                    },
                    {
                        id: 'bar',
                        artist: 'not f1',
                        album: 'f2'
                    }
                ]);
                expect(nextState.editInfo.newValues).to.deep.equal({
                    artist: { active: false, value: 'f1' },
                    album: { active: true, value: 'f2' },
                    title: { active: true, value: undefined },
                    track: { active: true, value: undefined }
                });
            });
        });
    });

    describe('close', () => {
        describe('if cancelling', () => {
            it('should hide the edit window', () => {
                expect(R.close(fromJS({ editInfo: { hidden: false } }), { cancel: true }).toJS())
                    .to.deep.equal({ editInfo: { hidden: true } });
            });
        });
        describe('otherwise', () => {
            it('should set the state to loading, while the saga calls the API', () => {
                expect(R.close(fromJS({ editInfo: { loading: false } }), { cancel: false }).toJS())
                    .to.deep.equal({ editInfo: { loading: true } });
            });
        });
    });

    describe('changeEditValue', () => {
        it('should set edit values in the state', () => {
            expect(R.changeEditValue(fromJS({
                editInfo: {
                    newValues: {
                        foo: { value: 'not bar' }
                    }
                }
            }), { key: 'foo', value: 'bar' }).toJS())
                .to.deep.equal({
                    editInfo: { newValues: { foo: { value: 'bar' } } }
                });
        });
    });

    describe('receiveUpdatedEditValues', () => {
        const prevState = {
            editInfo: {
                hidden: false,
                songs: [
                    { id: 'foo', artist: 'f1', album: 'f2' }
                ],
                newValues: {
                    artist: { active: true, value: 'f1' },
                    album: { active: true, value: 'f2new' },
                    track: { active: true, value: 3 }
                }
            },
            songList: {
                songs: [
                    { id: 'foo', artist: 'f1', album: 'f2' },
                    { id: 'bar', artist: 'g1', album: 'g2' }
                ],
                orderKeys: []
            }
        };

        describe('if an invalid response was given', () => {
            it('should simply close the edit dialog', () => {
                expect(R.receiveUpdatedEditValues(fromJS(prevState), { data: { foo: 'bar' } }).toJS())
                    .to.deep.equal({
                        ...prevState,
                        editInfo: {
                            loading: false,
                            hidden: true,
                            songs: null,
                            newValues: {}
                        }
                    });
            });
        });
        describe('otherwise', () => {
            it('should merge the updated data with the previous state', () => {
                expect(R.receiveUpdatedEditValues(fromJS(prevState), { data: { success: true } }).toJS())
                    .to.deep.equal({
                        editInfo: {
                            loading: false,
                            hidden: true,
                            songs: null,
                            newValues: {}
                        },
                        songList: {
                            songs: [
                                { id: 'foo', artist: 'f1', album: 'f2new', track: 3, trackNo: '3' },
                                { id: 'bar', artist: 'g1', album: 'g2' }
                            ],
                            orderKeys: []
                        }
                    });
            });
        });
    });
});

