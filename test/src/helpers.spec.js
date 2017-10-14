/* eslint-disable no-undefined */
import { expect } from 'chai';

import * as H from '../../src/helpers';

describe('Helpers', () => {
    describe('handleNaN', () => {
        it('should return a default value if NaN or undefined is passed', () => {
            expect(H.handleNaN(NaN, 'foo')).to.equal('foo');
            expect(H.handleNaN(undefined, 'foo')).to.equal('foo');
            expect(H.handleNaN('bar', 'foo')).to.equal('foo');
        });

        it('should return the passed value if it is defined and not NaN', () => {
            expect(H.handleNaN(4)).to.equal(4);
        });

        it('should use 0 as the default value if none is passed', () => {
            expect(H.handleNaN(NaN)).to.equal(0);
        });
    });
});

