/* eslint-disable newline-per-chained-call */
import { expect } from 'chai';
import { fromJS } from 'immutable';
import '../../browser';
import React from 'react';
import shallow from '../../shallow-with-store';
import { createMockStore } from 'redux-test-utils';
import VolumeControl from '../../../src/containers/volume-control';

describe('<VolumeControl />', () => {
    const state = {
        player: {
            volume: 0.5
        }
    };

    it('should render its basic structure', () => {
        const wrapper = shallow(<VolumeControl />, createMockStore(fromJS(state))).dive();

        expect(wrapper.is('div.volume-control-outer')).to.equal(true);
        expect(wrapper.children()).to.have.length(1);
        expect(wrapper.childAt(0).is('div.gutter')).to.equal(true);

        expect(wrapper.childAt(0).children()).to.have.length(2);

        expect(wrapper.childAt(0).childAt(0).is('div.inner')).to.equal(true);
        expect(wrapper.childAt(0).childAt(1).is('div.head')).to.equal(true);
    });
});

