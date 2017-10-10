import { List as list } from 'immutable';
import { expect } from 'chai';

import state from '../../../src/initialState';

import { selectItem } from '../../../src/reducers/song-list.reducer';

describe('Song list reducer', () => {
    describe('selectItem', () => {
        it('should select an item', () => {
            const stateWithSelections = state
                .setIn(['songList', 'lastClicked'], -1)
                .setIn(['songList', 'selectedIndices'], list([0, 5]));

            const result = selectItem(stateWithSelections, {
                shift: false, ctrl: false, index: 3
            });

            expect(result.getIn(['songList', 'selectedIndices']).toJS())
                .to.deep.equal([3]);

            expect(result.getIn(['songList', 'lastClicked']))
                .to.equal(3);
        });

        it('should select or deselect multiple items with the ctrl key', () => {
            const stateWithSelections = state
                .setIn(['songList', 'selectedIndices'], list([0, 5]));

            const resultAdd = selectItem(stateWithSelections, {
                shift: false, ctrl: true, index: 3
            });

            expect(resultAdd.getIn(['songList', 'selectedIndices']).toJS())
                .to.deep.equal([0, 5, 3]);

            const resultRemove = selectItem(stateWithSelections, {
                shift: false, ctrl: true, index: 0
            });

            expect(resultRemove.getIn(['songList', 'selectedIndices']).toJS())
                .to.deep.equal([5]);

            const resultRemoveFromAdd = selectItem(resultAdd, {
                shift: false, ctrl: true, index: 3
            });

            expect(resultRemoveFromAdd.getIn(['songList', 'selectedIndices']).toJS())
                .to.deep.equal([0, 5]);
        });

        it('should select ranges with the shift key', () => {
            const indices = currentState => currentState
                .getIn(['songList', 'selectedIndices'])
                .toJS();

            const stateWithNoSelections = state;

            let nextResult = selectItem(stateWithNoSelections, {
                shift: true, ctrl: false, index: 3
            });

            // shift-clicked with nothing selected
            expect(indices(nextResult)).to.deep.equal([3]);

            nextResult = selectItem(nextResult, {
                shift: true, ctrl: false, index: 3
            });

            // shift-clicked again on same item; no change
            expect(indices(nextResult)).to.deep.equal([3]);

            nextResult = selectItem(nextResult, {
                shift: true, ctrl: false, index: 6
            });

            // shift-clicked to select up to 6, from 3
            expect(indices(nextResult)).to.have.same.members([3, 4, 5, 6]);

            nextResult = selectItem(nextResult, {
                shift: true, ctrl: false, index: 1
            });

            // shift-clicked back down to 1
            expect(indices(nextResult)).to.have.same.members([1, 2, 3, 4, 5, 6]);

            nextResult = selectItem(nextResult, {
                shift: false, ctrl: true, index: 14
            });

            // ctrl-clicked to start a new range at 14
            expect(indices(nextResult)).to.have.same.members([1, 2, 3, 4, 5, 6, 14]);

            nextResult = selectItem(nextResult, {
                shift: true, ctrl: false, index: 10
            });

            // shift-clicked to select the range from 14 to 10
            expect(indices(nextResult)).to.have.same.members(
                [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14]
            );
        });
    });
});

