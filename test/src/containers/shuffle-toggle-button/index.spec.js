/* eslint-disable no-undefined */
import { fromJS } from 'immutable';
import { expect } from 'chai';
import '../../../browser';
import shallow from '../../../shallow-with-store';
import { createMockStore } from 'redux-test-utils';
import React from 'react';

import ShuffleToggleButton from '../../../../src/containers/shuffle-toggle-button';
import { SHUFFLE_ALL, SHUFFLE_NONE } from '../../../../src/constants/misc';
import { AUDIO_MODE_SHUFFLE_SET } from '../../../../src/constants/actions';

describe('<ShuffleToggleButton />', () => {
    it('should render its basic structure', () => {
        const wrapper = shallow(<ShuffleToggleButton />, createMockStore(fromJS({
            player: {
                shuffle: SHUFFLE_NONE
            }
        }))).dive();

        expect(wrapper.is('div.shuffle-toggle-button')).to.equal(true);
        expect(wrapper.children()).to.have.length(1);
        expect(wrapper.childAt(0).is('button')).to.equal(true);
    });

    it('should render an active class', () => {
        const wrapper = shallow(<ShuffleToggleButton />, createMockStore(fromJS({
            player: {
                shuffle: SHUFFLE_ALL
            }
        }))).dive();

        expect(wrapper.is('div.shuffle-toggle-button.active')).to.equal(true);
    });

    it('should toggle shuffle on click', () => {
        const state = fromJS({
            player: {
                shuffle: SHUFFLE_NONE
            }
        });

        const store = createMockStore(state);

        const wrapper = shallow(<ShuffleToggleButton />, store).dive();

        expect(store.isActionDispatched({ type: AUDIO_MODE_SHUFFLE_SET, payload: undefined })).to.equal(false);

        wrapper.childAt(0).simulate('click');
        expect(store.isActionDispatched({ type: AUDIO_MODE_SHUFFLE_SET, payload: undefined })).to.equal(true);
    });
});


