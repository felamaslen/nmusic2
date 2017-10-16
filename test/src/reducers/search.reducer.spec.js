import { fromJS } from 'immutable';
import { expect } from 'chai';
import itEach from 'it-each';

itEach();

import * as R from '../../../src/reducers/search.reducer';

describe('Search reducer', () => {
    describe('getSearchKeyCategory', () => {
        const state = fromJS({
            search: {
                artists: [0, 0, 0],
                albums: [0, 0, 0, 0, 0],
                songs: [0]
            }
        });

        it.each([0, 1, 2], 'should map 0..2 to artists', key => {
            expect(R.getSearchKeyCategory(state.setIn(['search', 'navIndex'], key)))
                .to.deep.equal({ key, category: 'artists' });
        });

        it.each([3, 4, 5, 6, 7], 'should map 3..7 to albums', key => {
            expect(R.getSearchKeyCategory(state.setIn(['search', 'navIndex'], key)))
                .to.deep.equal({ key: key - 3, category: 'albums' });
        });

        it.each([8], 'should map 8..8 to songs', key => {
            expect(R.getSearchKeyCategory(state.setIn(['search', 'navIndex'], key)))
                .to.deep.equal({ key: key - 8, category: 'songs' });
        });
    });
});

