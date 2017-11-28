import { fromJS } from 'immutable';
import { expect } from 'chai';
import * as R from '../../../src/reducers/edit.reducer';

describe('Edit reducer', () => {
    describe('open', () => {
        it('should do nothing if there is no clicked id', () => {
            expect(R.open(fromJS({ foo: 'bar' })).toJS()).to.deep.equal({ foo: 'bar' });
        });

        it('should do nothing if there is no song matching the clicked id', () => {
            const state = {
                songList: {
                    lastClickedId: 'foo',
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
                    lastClickedId: 'foo',
                    songs: [
                        {
                            id: 'foo',
                            field1: 'f1',
                            field2: 'f2'
                        },
                        {
                            id: 'bar',
                            field1: 'no'
                        }
                    ]
                },
                editInfo: {}
            };

            const nextState = R.open(fromJS(prevState)).toJS();

            it('should set the correct info in the editInfo map', () => {
                expect(nextState.editInfo.song).to.deep.equal({
                    id: 'foo',
                    field1: 'f1',
                    field2: 'f2'
                });
                expect(nextState.editInfo.newValues).to.deep.equal({
                    id: 'foo',
                    field1: 'f1',
                    field2: 'f2'
                });
            });

            it('should unhide the edit window', () => {
                expect(nextState.editInfo.hidden).to.equal(false);
            });

            it('should hide the context menu', () => {
                expect(nextState.songList.menu.hidden).to.equal(true);
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
            expect(R.changeEditValue(fromJS({ editInfo: { newValues: {} } }), { key: 'foo', value: 'bar' }).toJS())
                .to.deep.equal({
                    editInfo: { newValues: { foo: 'bar' } }
                });
        });
    });

    describe('receiveUpdatedEditValues', () => {
        const prevState = {
            editInfo: {
                hidden: false,
                song: { id: 'foo', field1: 'f1', field2: 'f2' },
                newValues: { id: 'foo', field1: 'f1', field2: 'f2new' }
            },
            songList: {
                songs: [
                    { id: 'foo', field1: 'f1', field2: 'f2' },
                    { id: 'bar', field1: 'g1', field2: 'g2' }
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
                            song: null,
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
                            song: null,
                            newValues: {}
                        },
                        songList: {
                            songs: [
                                { id: 'foo', field1: 'f1', field2: 'f2new', trackNo: '' },
                                { id: 'bar', field1: 'g1', field2: 'g2' }
                            ],
                            orderKeys: []
                        }
                    });
            });
        });
    });
});

