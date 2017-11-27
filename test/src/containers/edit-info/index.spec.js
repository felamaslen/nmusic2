import { fromJS } from 'immutable';
import '../../../browser';
import { expect } from 'chai';
import React from 'react';
import shallow from '../../../shallow-with-store';
import { createMockStore } from 'redux-test-utils';
import EditInfo from '../../../../src/containers/edit-info';

describe('<EditInfo />', () => {
    it('should render null if inactive', () => {
        const wrapper = shallow(<EditInfo />, createMockStore(fromJS({
            editInfo: {
                song: null
            }
        }))).dive();

        expect(wrapper.get(0)).to.equal(null);
    });

    it('should render its basic structure', () => {
        const wrapper = shallow(<EditInfo />, createMockStore(fromJS({
            editInfo: {
                song: { id: 'foo' },
                hidden: false
            }
        }))).dive();

        expect(wrapper.is('div.edit-info-outer')).to.equal(true);
    });
});

