import { expect } from 'chai';
import '../../browser';
import { shallow } from 'enzyme';
import React from 'react';
import StatusBar from '../../../src/components/status-bar';
import ShuffleToggleButton from '../../../src/containers/shuffle-toggle-button';

describe('<StatusBar />', () => {
    it('should render its basic structure', () => {
        const wrapper = shallow(<StatusBar />);

        expect(wrapper.is('div.status-bar-outer')).to.equal(true);
        expect(wrapper.children()).to.have.length(1);
    });
    it('should render a shuffle toggle button', () => {
        const wrapper = shallow(<StatusBar />);

        expect(wrapper.childAt(0).is(ShuffleToggleButton)).to.equal(true);
    });
});

