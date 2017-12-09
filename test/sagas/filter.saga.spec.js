/* eslint-disable prefer-reflect */
import { fromJS } from 'immutable'
import { expect } from 'chai'
import axios from 'axios'
import { testSaga } from 'redux-saga-test-plan'

import * as S from '../../src/sagas/filter.saga'
import * as A from '../../src/actions/filter.actions'

describe('Filter saga', () => {
    describe('selectArtistFilter', () => {
        it('should get the artist filter', () => {
            expect(S.selectArtistFilter(fromJS({
                filter: {
                    artist: 'foo',
                    album: 'bar'
                }
            }))).to.equal('foo')
        })
    })
    describe('fetchFilterList', () => {
        it('should fetch artists', () => {
            return testSaga(S.fetchFilterList, { payload: { key: 'artist' } })
                .next()
                .call(axios.get, 'api/v1/artists')
                .next({ data: ['artist1', 'foo', 'bar'] })
                .put(A.filterListReceived({ items: ['artist1', 'foo', 'bar'], key: 'artist' }))
                .next()
                .isDone()
        })
        it('should fetch albums', () => {
            return testSaga(S.fetchFilterList, { payload: { key: 'album' } })
                .next()
                .select(S.selectArtistFilter)
                .next(fromJS({ selectedKeys: [1], items: ['foo', 'some artist'] }))
                .call(axios.get, 'api/v1/albums/some%20artist')
                .next({ data: ['foo'] })
                .put(A.filterListReceived({ items: ['foo'], key: 'album' }))
                .next()
                .isDone()
        })
        it('should handle errors gracefully', () => {
            return testSaga(S.fetchFilterList, { payload: { key: 'artist' } })
                .next()
                .call(axios.get, 'api/v1/artists')
                .throw(new Error('some error'))
                .put(A.filterListReceived({ err: new Error('some error') }))
                .next()
                .isDone()
        })
    })
})

