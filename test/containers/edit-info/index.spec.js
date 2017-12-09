/* eslint-disable newline-per-chained-call */
import { fromJS } from 'immutable';
import '../../browser';
import { expect } from 'chai';
import itEach from 'it-each';
itEach();
import React from 'react';
import shallow from '../../shallow-with-store';
import { createMockStore } from 'redux-test-utils';
import EditInfo from '../../../src/containers/edit-info';
import EditInfoFormRow from '../../../src/containers/edit-info/form-row';
import { Artwork } from '../../../src/containers/artwork';

describe('<EditInfo />', () => {
    const state = {
        editInfo: {
            songs: { id: 'foo' },
            hidden: false,
            newValues: {},
            artwork: 'artwork-test'
        }
    };

    it('should render null if inactive', () => {
        const wrapper = shallow(<EditInfo />, createMockStore(fromJS({
            editInfo: {
                ...state.editInfo,
                songs: null
            }
        }))).dive();

        expect(wrapper.get(0)).to.equal(null);
    });

    it('should render a hidden class', () => {
        const wrapper = shallow(<EditInfo />, createMockStore(fromJS({
            editInfo: {
                ...state.editInfo,
                hidden: true
            }
        }))).dive();

        expect(wrapper.hasClass('hidden')).to.equal(true);
    });

    it('should render its basic structure', () => {
        const wrapper = shallow(<EditInfo />, createMockStore(fromJS(state))).dive();

        expect(wrapper.is('div.edit-info-outer')).to.equal(true);
        expect(wrapper.children()).to.have.length(1);
        expect(wrapper.childAt(0).is('div.edit-info')).to.equal(true);
        expect(wrapper.childAt(0).children()).to.have.length(1);
        expect(wrapper.childAt(0).childAt(0).is('div.inner')).to.equal(true);
        expect(wrapper.childAt(0).childAt(0).children()).to.have.length(2);

        const infoOuter = wrapper.childAt(0).childAt(0).childAt(0);
        const buttons = wrapper.childAt(0).childAt(0).childAt(1);

        expect(infoOuter.is('div.info-outer')).to.equal(true);
        expect(infoOuter.children()).to.have.length(2);
        expect(infoOuter.childAt(0).is(Artwork)).to.equal(true);
        expect(infoOuter.childAt(0).props()).to.have.property('src', 'artwork-test');
        expect(infoOuter.childAt(1).is('div.info')).to.equal(true);
        expect(infoOuter.childAt(1).children()).to.have.length(4);

        expect(buttons.is('div.buttons')).to.equal(true);
        expect(buttons.children()).to.have.length(2);

        expect(buttons.childAt(0).is('button.button-cancel')).to.equal(true);
        expect(buttons.childAt(0).text()).to.equal('Cancel');

        expect(buttons.childAt(1).is('button.button-ok')).to.equal(true);
        expect(buttons.childAt(1).text()).to.equal('OK');
    });

    describe('form fields', () => {
        const wrapper = shallow(<EditInfo />, createMockStore(fromJS(state))).dive();

        const info = wrapper.childAt(0).childAt(0).childAt(0).childAt(1);

        let key = 0;

        it.each([
            { label: 'Track', field: 'track', type: 'number' },
            { label: 'Title', field: 'title' },
            { label: 'Artist', field: 'artist' },
            { label: 'Album', field: 'album' }
        ], 'should be rendered', ({ label, field, type }) => {

            expect(info.childAt(key).is(EditInfoFormRow)).to.equal(true);

            const props = info.childAt(key).props();

            expect(props).to.have.property('label', label);
            expect(props).to.have.property('field', field);

            if (type) {
                expect(props).to.have.property('type', type);
            }

            key++;
        });
    });
});

