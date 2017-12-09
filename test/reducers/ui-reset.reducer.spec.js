import { fromJS } from 'immutable'
import { expect } from 'chai'
import itEach from 'it-each'
itEach();
import * as R from '../../../src/reducers/ui-reset.reducer'

describe('UIReset reducer', () => {
    describe('reset', () => {
        it('should hide the song list context menu', () => {
            expect(R.reset(fromJS({ songList: { menu: { hidden: false, foo: 'bar' } } })).toJS())
                .to.deep.equal({ songList: { menu: { hidden: true, foo: 'bar' } } })
        })
    })

    describe('loadSettings', () => {
        it.each([

            ['sidebar_hidden', { sidebar: { hidden: 'foo' } }],
            ['sidebar_displayOver', { sidebar: { displayOver: 'foo' } }]

        ], 'should set properties if they exist', ([key, expectedState]) => {
            const state = fromJS({});

            expect(R.loadSettings(state, { [key]: 'foo' }).toJS())
                .to.deep.equal({ settingsLoaded: true, ...expectedState });
        })
    })
})

