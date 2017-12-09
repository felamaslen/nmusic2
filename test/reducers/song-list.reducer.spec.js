import { fromJS, List as list, Map as map } from 'immutable';
import { expect } from 'chai';

import state from '../../../src/initialState';

import * as R from '../../../src/reducers/song-list.reducer';

describe('Song list reducer', () => {
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

            const resultSimple = R.getOrderedSongList(null, testSongs, list([
                map({ key: 'key1', order: 1 })
            ]));

            expect(resultSimple.toJS()).to.deep.equal([
                { key1: 'aoz', key2: 'kek' },
                { key1: 'foo', key2: 'zav' },
                { key1: 'foo', key2: 'bak' },
                { key1: 'zef', key2: 'rak' }
            ]);

            const resultTwo = R.getOrderedSongList(null, testSongs, list([
                map({ key: 'key2', order: 1 }),
                map({ key: 'key1', order: 1 })
            ]));

            expect(resultTwo.toJS()).to.deep.equal([
                { key1: 'aoz', key2: 'kek' },
                { key1: 'foo', key2: 'bak' },
                { key1: 'foo', key2: 'zav' },
                { key1: 'zef', key2: 'rak' }
            ]);

            const resultReverse = R.getOrderedSongList(null, testSongs, list([
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

    describe('addToQueue', () => {
        it('should add a song to the queue', () => {
            expect(R.addToQueue(fromJS({ queue: { songs: [] } }), 'foo').get('queue')
                .toJS()
            )
                .to.deep.equal({ songs: ['foo'] });
        });
        it('should close the context menu', () => {
            expect(R.addToQueue(fromJS({ queue: { songs: [] }, songList: { menu: { hidden: false } } }), 'foo')
                .getIn(['songList', 'menu', 'hidden']))
                .to.equal(true);
        });
    });

    describe('openMenu', () => {
        it('should open a menu based on a song and mouse position', () => {
            expect(R.openMenu(fromJS({ songList: {} }), { posX: 1, posY: 2 }).toJS())
                .to.deep.equal({
                    songList: {
                        menu: {
                            posX: 1,
                            posY: 2,
                            hidden: false
                        }
                    }
                });
        });
    });
});

