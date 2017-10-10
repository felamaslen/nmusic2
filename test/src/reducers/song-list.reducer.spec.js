import { List as list, Map as map } from 'immutable';
import { expect } from 'chai';

import state from '../../../src/initialState';

import * as R from '../../../src/reducers/song-list.reducer';

describe('Song list reducer', () => {
    describe('getNewlySelectedKeys', () => {
        it('should select an item', () => {
            const result = R.getNewlySelectedKeys(list([0, 5]), -1, {
                shift: false, ctrl: false, index: 3
            });

            expect(result.toJS()).to.deep.equal([3]);
        });

        it('should select or deselect multiple items with the ctrl key', () => {
            const resultAdd = R.getNewlySelectedKeys(list([0, 5]), -1, {
                shift: false, ctrl: true, index: 3
            });

            expect(resultAdd.toJS()).to.have.same.members([0, 5, 3]);

            const resultRemove = R.getNewlySelectedKeys(list([0, 5]), -1, {
                shift: false, ctrl: true, index: 0
            });

            expect(resultRemove.toJS()).to.have.same.members([5]);

            const resultRemoveFromAdd = R.getNewlySelectedKeys(list([0, 5, 3]), 0, {
                shift: false, ctrl: true, index: 3
            });

            expect(resultRemoveFromAdd.toJS()).to.have.same.members([0, 5]);
        });

        it('should select ranges with the shift key', () => {
            let nextResult = R.getNewlySelectedKeys(list([]), -1, {
                shift: true, ctrl: false, index: 3
            });

            // shift-clicked with nothing selected
            expect(nextResult.toJS()).to.deep.equal([3]);

            nextResult = R.getNewlySelectedKeys(nextResult, 3, {
                shift: true, ctrl: false, index: 3
            });

            // shift-clicked again on same item; no change
            expect(nextResult.toJS()).to.deep.equal([3]);

            nextResult = R.getNewlySelectedKeys(nextResult, 3, {
                shift: true, ctrl: false, index: 6
            });

            // shift-clicked to select up to 6, from 3
            expect(nextResult.toJS()).to.have.same.members([3, 4, 5, 6]);

            nextResult = R.getNewlySelectedKeys(nextResult, 6, {
                shift: true, ctrl: false, index: 1
            });

            // shift-clicked back down to 1
            expect(nextResult.toJS()).to.have.same.members([1, 2, 3, 4, 5, 6]);

            nextResult = R.getNewlySelectedKeys(nextResult, 1, {
                shift: false, ctrl: true, index: 14
            });

            // ctrl-clicked to start a new range at 14
            expect(nextResult.toJS()).to.have.same.members([1, 2, 3, 4, 5, 6, 14]);

            nextResult = R.getNewlySelectedKeys(nextResult, 14, {
                shift: true, ctrl: false, index: 10
            });

            // shift-clicked to select the range from 14 to 10
            expect(nextResult.toJS()).to.have.same.members(
                [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14]
            );
        });
    });

    describe('getNewlySelectedIds', () => {
        it('should map keys to ids', () => {
            const testSongs = list(['foo', 'bar', 'baz', 'bap', 'pad', 'wav', 'paz'])
                .map(id => map({ id }));

            const selectedIds = list(['foo', 'baz', 'bap']);

            const testState = state
                .setIn(['songList', 'songs'], testSongs)
                .setIn(['songList', 'selectedIds'], selectedIds)
                .setIn(['songList', 'lastClickedId'], 'bap');

            const result1 = R.getNewlySelectedIds(testState, { index: 4 });

            expect(result1.toJS()).to.have.same.members((['pad']));

            const result2 = R.getNewlySelectedIds(testState, { index: 5, shift: true });

            expect(result2.toJS()).to.have.same.members(['foo', 'baz', 'bap', 'pad', 'wav']);
        });
    });

    describe('getNewOrderKeys', () => {
        it('should push the key to the top of the list if it doesn\'t already exist', () => {
            expect(R.getNewOrderKeys(list([]), 'd').toJS())
                .to.deep.equal([{ key: 'd', order: 1 }]);
        });

        it('should reverse the order of the selected key if it exists at the top', () => {
            expect(R.getNewOrderKeys(list([map({ key: 'a', order: 1 })]), 'a').toJS())
                .to.deep.equal([{ key: 'a', order: -1 }]);
        });

        it('should reset the list if it currently exists below the top', () => {
            expect(R.getNewOrderKeys(list([
                map({ key: 'b', order: 1 }),
                map({ key: 'a', order: 1 })
            ]), 'b').toJS())
                .to.deep.equal([{ key: 'b', order: 1 }]);
        });
    });

    describe('getOrderedSongList', () => {
        it('should sort by an ordered list of keys', () => {
            const testSongs = list([
                map({ key1: 'foo', key2: 'zav' }),
                map({ key1: 'foo', key2: 'bak' }),
                map({ key1: 'aoz', key2: 'kek' }),
                map({ key1: 'zef', key2: 'rak' })
            ]);

            const resultSimple = R.getOrderedSongList(testSongs, list([
                map({ key: 'key1', order: 1 })
            ]));

            expect(resultSimple.toJS()).to.deep.equal([
                { key1: 'aoz', key2: 'kek' },
                { key1: 'foo', key2: 'zav' },
                { key1: 'foo', key2: 'bak' },
                { key1: 'zef', key2: 'rak' }
            ]);

            const resultTwo = R.getOrderedSongList(testSongs, list([
                map({ key: 'key2', order: 1 }),
                map({ key: 'key1', order: 1 })
            ]));

            expect(resultTwo.toJS()).to.deep.equal([
                { key1: 'aoz', key2: 'kek' },
                { key1: 'foo', key2: 'bak' },
                { key1: 'foo', key2: 'zav' },
                { key1: 'zef', key2: 'rak' }
            ]);

            const resultReverse = R.getOrderedSongList(testSongs, list([
                map({ key: 'key1', order: -1 }),
                map({ key: 'key2', order: 1 })
            ]));

            expect(resultReverse.toJS()).to.deep.equal([
                { key1: 'foo', key2: 'bak' },
                { key1: 'aoz', key2: 'kek' },
                { key1: 'zef', key2: 'rak' },
                { key1: 'foo', key2: 'zav' }
            ]);
        });
    });
});

