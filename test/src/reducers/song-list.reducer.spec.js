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
        it('should move the key to the top of the list if it already exists', () => {
            expect(R.getNewOrderKeys(list(['a', 'b', 'c']), 'b').toJS())
                .to.deep.equal(['a', 'c', 'b']);
        });

        it('should push the key to the top of the list if it doesn\'t already exist', () => {
            expect(R.getNewOrderKeys(list(['a', 'b', 'c']), 'd').toJS())
                .to.deep.equal(['a', 'b', 'c', 'd']);
        });
    });

    describe('getOrderedSongList', () => {
        it('should sort by an ordered list of keys', () => {
            const testSongs = list([
                map({ key1: 'foo', key2: 'zav' }),
                map({ key1: 'baz', key2: 'bak' }),
                map({ key1: 'foz', key2: 'kek' }),
                map({ key1: 'zef', key2: 'rak' })
            ]);

            const resultSimple = R.getOrderedSongList(testSongs, list(['key1']));

            expect(resultSimple.toJS()).to.deep.equal([
                { key1: 'baz', key2: 'bak' },
                { key1: 'foo', key2: 'zav' },
                { key1: 'foz', key2: 'kek' },
                { key1: 'zef', key2: 'rak' }
            ]);

            const resultTwo = R.getOrderedSongList(testSongs, list(['key1', 'key2']));

            expect(resultTwo.toJS()).to.deep.equal([
                { key1: 'baz', key2: 'bak' },
                { key1: 'foz', key2: 'kek' },
                { key1: 'zef', key2: 'rak' },
                { key1: 'foo', key2: 'zav' }
            ]);

            const resultReverse = R.getOrderedSongList(testSongs, list(['key2', 'key1']));

            expect(resultReverse.toJS()).to.deep.equal([
                { key1: 'baz', key2: 'bak' },
                { key1: 'foo', key2: 'zav' },
                { key1: 'foz', key2: 'kek' },
                { key1: 'zef', key2: 'rak' }
            ]);
        });
    });
});

