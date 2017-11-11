import { expect } from 'chai';
import { fromJS } from 'immutable';

import * as R from '../../../src/reducers/sidebar.reducer';

describe('Sidebar reducer', () => {
    describe('hide', () => {
        it('should toggle the sidebar', () => {
            expect(R.hide(fromJS({ sidebar: { hidden: false } })).getIn(['sidebar', 'hidden'])).to.equal(true);
            expect(R.hide(fromJS({ sidebar: { hidden: true } })).getIn(['sidebar', 'hidden'])).to.equal(false);
        });
    });
});

