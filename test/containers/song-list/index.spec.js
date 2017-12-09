/* eslint-disable newline-per-chained-call */
import { fromJS } from 'immutable';
import '../../browser';
import { expect } from 'chai';
import React from 'react';
import shallow from '../../shallow-with-store';
import { createMockStore } from 'redux-test-utils';
import SongList from '../../../src/containers/song-list';
import SongListHead from '../../../src/containers/song-list/list-head';
import SongListMenu from '../../../src/containers/song-list/menu';

describe('<SongList />', () => {
    const state = {
        songList: {
            songs: [
                { id: 1 },
                { id: 2 }
            ]
        }
    };

    it('should render its basic structure', () => {
        const wrapper = shallow(<SongList />, createMockStore(fromJS(state))).dive();

        expect(wrapper.is('div.song-list-outer')).to.equal(true);
        expect(wrapper.children()).to.have.length(3);
    });

    it('should render a list head', () => {
        const wrapper = shallow(<SongList />, createMockStore(fromJS(state))).dive();

        expect(wrapper.childAt(0).is(SongListHead)).to.equal(true);
    });

    it('should render a list body', () => {
        const wrapper = shallow(<SongList />, createMockStore(fromJS(state))).dive();

        expect(wrapper.childAt(1).is('div.song-list')).to.equal(true);
    });

    it('should render a context menu', () => {
        const wrapper = shallow(<SongList />, createMockStore(fromJS(state))).dive();

        expect(wrapper.childAt(2).is(SongListMenu)).to.equal(true);
    });
});

