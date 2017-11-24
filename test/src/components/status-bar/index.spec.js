import { expect } from 'chai';
import '../../../browser';
import { shallow } from 'enzyme';
import React from 'react';
import StatusBar from '../../../../src/components/status-bar';

describe('<StatusBar />', () => {
    it('should render its basic structure', () => {
        const wrapper = shallow(<StatusBar />);

        expect(wrapper.is('div.status-bar-outer')).to.equal(true);
    });
});

