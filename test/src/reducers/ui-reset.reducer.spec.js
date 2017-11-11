import { fromJS } from 'immutable'
import { expect } from 'chai'
import * as R from '../../../src/reducers/ui-reset.reducer'

describe('UIReset reducer', () => {
    describe('reset', () => {
        it('should hide the song list context menu', () => {
            expect(R.reset(fromJS({ songList: { menu: { hidden: false, foo: 'bar' } } })).toJS())
                .to.deep.equal({ songList: { menu: { hidden: true, foo: 'bar' } } })
        })
    })
})

