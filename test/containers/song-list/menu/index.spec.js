/* eslint-disable newline-per-chained-call, no-undefined */
import { fromJS } from 'immutable';
import '../../../../browser';
import { expect } from 'chai';
import React from 'react';
import shallow from '../../../../shallow-with-store';
import { createMockStore } from 'redux-test-utils';
import SongListMenu from '../../../../../src/containers/song-list/menu';

describe('<SongListMenu />', () => {
    it('should render its basic structure', () => {
        const wrapper = shallow(<SongListMenu />, createMockStore(fromJS({
            songList: {
                menu: {
                    hidden: false,
                    song: {
                        id: 'foo'
                    },
                    posX: 10,
                    posY: 14
                }
            }
        }))).dive();

        expect(wrapper.is('div.menu')).to.equal(true);
        expect(wrapper.children()).to.have.length(1);
        expect(wrapper.childAt(0).is('ul.menu-list')).to.equal(true);
        expect(wrapper.childAt(0).children()).to.have.length(2);
    });

    it('should render an add-to-queue item', () => {
        const store = createMockStore(fromJS({
            songList: {
                menu: {
                    hidden: false,
                    song: {
                        id: 'foo'
                    },
                    posX: 10,
                    posY: 14
                }
            }
        }));

        const wrapper = shallow(<SongListMenu />, store).dive();

        expect(store.isActionDispatched({ type: 'SONG_LIST_QUEUE_ADDED', payload: undefined })).to.equal(false);
        wrapper.childAt(0).childAt(0).simulate('mousedown');
        expect(store.isActionDispatched({ type: 'SONG_LIST_QUEUE_ADDED', payload: undefined })).to.equal(true);
    });

    it('should render an edit-song item', () => {
        const store = createMockStore(fromJS({
            songList: {
                menu: {
                    hidden: false,
                    song: {
                        id: 'foo'
                    },
                    posX: 10,
                    posY: 14
                }
            }
        }));

        const wrapper = shallow(<SongListMenu />, store).dive();

        expect(store.isActionDispatched({ type: 'EDIT_INFO_OPENED', payload: undefined })).to.equal(false);

        wrapper.childAt(0).childAt(1).simulate('mousedown');
        expect(store.isActionDispatched({ type: 'EDIT_INFO_OPENED', payload: undefined })).to.equal(true);
    });
});

