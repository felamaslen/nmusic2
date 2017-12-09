import { expect } from 'chai';
import { fromJS } from 'immutable';

import * as R from '../../src/reducers/sidebar.reducer';

describe('Sidebar reducer', () => {
    describe('toggleHidden', () => {
        it('should toggle the sidebar', () => {
            expect(R.toggleHidden(fromJS({ sidebar: { hidden: false } })).getIn(['sidebar', 'hidden'])).to.equal(true);
            expect(R.toggleHidden(fromJS({ sidebar: { hidden: true } })).getIn(['sidebar', 'hidden'])).to.equal(false);
        });
    });

    describe('toggleDisplayOver', () => {
        it('should toggle displayOver', () => {
            expect(R.toggleDisplayOver(fromJS({ sidebar: { displayOver: false } }))
                .getIn(['sidebar', 'displayOver'])).to.equal(true);
            expect(R.toggleDisplayOver(fromJS({ sidebar: { displayOver: true } }))
                .getIn(['sidebar', 'displayOver'])).to.equal(false);
        });
        it('should unhide the sidebar', () => {
            expect(R.toggleDisplayOver(fromJS({ sidebar: { displayOver: false, hidden: true } }))
                .getIn(['sidebar', 'hidden'])).to.equal(false);
            expect(R.toggleDisplayOver(fromJS({ sidebar: { displayOver: true, hidden: true } }))
                .getIn(['sidebar', 'hidden'])).to.equal(false);
            expect(R.toggleDisplayOver(fromJS({ sidebar: { displayOver: true, hidden: false } }))
                .getIn(['sidebar', 'hidden'])).to.equal(false);
        });
    });
});

