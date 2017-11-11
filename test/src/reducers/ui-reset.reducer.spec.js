import { fromJS } from 'immutable'
import { expect } from 'chai'
import * as R from '../../../src/reducers/ui-reset.reducer'

describe('UIReset reducer', () => {
    describe('reset', () => {
        it('should reset the song list context menu', () => {
            expect(R.reset(fromJS({ songList: { menu: 'not null' } })).toJS())
                .to.deep.equal({ songList: { menu: null } })
        })
    })
})

