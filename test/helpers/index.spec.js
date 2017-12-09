import { List as list } from 'immutable';
import { expect } from 'chai';

import * as R from '../../src/helpers';

describe('Generic helper functions', () => {
    describe('getNewlySelectedKeys', () => {
        it('should select none if -1 is given as the index', () => {
            const result = R.getNewlySelectedKeys(list([0, 5]), 3, { index: -1 });

            expect(result.toJS()).to.deep.equal([]);
        });

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
});

