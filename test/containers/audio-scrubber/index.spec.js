/* eslint-disable newline-per-chained-call */
import { fromJS } from 'immutable';
import { expect } from 'chai';
import '../../browser';
import shallow from '../../shallow-with-store';
import { createMockStore } from 'redux-test-utils';
import React from 'react';
import AudioScrubber from '../../../src/containers/audio-scrubber';

describe('<AudioScrubber />', () => {
    const state = {
        player: {
            playTime: 4,
            dragTime: 5,
            duration: 100,
            bufferedRanges: [
                { left: 0, width: 5 },
                { left: 7, width: 2 }
            ]
        }
    };

    it('should render its basic structure', () => {
        const wrapper = shallow(<AudioScrubber />, createMockStore(fromJS(state))).dive();

        expect(wrapper.is('div.audio-scrubber')).to.equal(true);
        expect(wrapper.children()).to.have.length(3);
    });

    it('should render the current time played', () => {
        const wrapper = shallow(<AudioScrubber />, createMockStore(fromJS(state))).dive();

        expect(wrapper.childAt(0).is('span.time-played')).to.equal(true);
        expect(wrapper.childAt(0).text()).to.equal('00:04');
    });
});

