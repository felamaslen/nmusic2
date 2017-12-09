/* eslint-disable no-undefined */
import { expect } from 'chai';

import * as A from '../../src/actions/edit-info.actions';
import * as S from '../../src/constants/actions';

describe('Edit actions', () => {
    describe('editInfoOpened', () => {
        it('should return EDIT_INFO_OPENED', () => {
            expect(A.editInfoOpened()).to.deep.equal({ type: S.EDIT_INFO_OPENED, payload: undefined });
        });
    });
    describe('editInfoClosed', () => {
        it('should return EDIT_INFO_CLOSED with cancel parameter', () => {
            expect(A.editInfoClosed(true))
                .to.deep.equal({ type: S.EDIT_INFO_CLOSED, payload: { cancel: true } });

            expect(A.editInfoClosed(false))
                .to.deep.equal({ type: S.EDIT_INFO_CLOSED, payload: { cancel: false } });
        });
    });
    describe('editInfoValueChanged', () => {
        it('should return EDIT_INFO_VALUE_CHANGED with key and value', () => {
            expect(A.editInfoValueChanged('foo', 'bar')).to.deep.equal({
                type: S.EDIT_INFO_VALUE_CHANGED, payload: { key: 'foo', value: 'bar' }
            });
        });
    });
    describe('editInfoValuesUpdated', () => {
        it('should return EDIT_INFO_VALUES_UPDATED with result object', () => {
            expect(A.editInfoValuesUpdated({ foo: 'bar' })).to.deep.equal({
                type: S.EDIT_INFO_VALUES_UPDATED, payload: { foo: 'bar' }
            });
        });
    });
});

