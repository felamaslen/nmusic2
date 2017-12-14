import { expect } from 'chai';
import * as F from '../../src/helpers/format';

describe('Format helpers', () => {
    describe('leadingZeroes', () => {
        it('should add a 0 to numbers less than 10', () => {
            expect(F.leadingZeroes(0)).to.equal('00');
            expect(F.leadingZeroes(1)).to.equal('01');
            expect(F.leadingZeroes(9)).to.equal('09');
            expect(F.leadingZeroes(9.9)).to.equal('09.9');
        });

        it('should not touch other numbers', () => {
            expect(F.leadingZeroes(10)).to.equal('10');
            expect(F.leadingZeroes(11)).to.equal('11');
            expect(F.leadingZeroes(1923)).to.equal('1923');
        });
    });

    describe('formatSeconds', () => {
        it('should work for numbers less than 60', () => {
            expect(F.formatSeconds(0)).to.equal('00:00');
            expect(F.formatSeconds(4)).to.equal('00:04');
            expect(F.formatSeconds(55)).to.equal('00:55');
            expect(F.formatSeconds(59)).to.equal('00:59');
        });

        it('should work for numbers between 60 and 3600', () => {
            expect(F.formatSeconds(60)).to.equal('01:00');
            expect(F.formatSeconds(69)).to.equal('01:09');
            expect(F.formatSeconds(1192)).to.equal('19:52');
            expect(F.formatSeconds(3599)).to.equal('59:59');
        });

        it('should work for numbers in the hour range', () => {
            expect(F.formatSeconds(3600)).to.equal('01:00:00');
            expect(F.formatSeconds(3650)).to.equal('01:00:50');
            expect(F.formatSeconds(3750)).to.equal('01:02:30');
            expect(F.formatSeconds(86392)).to.equal('23:59:52');
        });
        it('should work for numbers in the day range', () => {
            expect(F.formatSeconds(86400)).to.equal('01:00:00:00');
            expect(F.formatSeconds(86420)).to.equal('01:00:00:20');
            expect(F.formatSeconds(99123912)).to.equal('1147:06:25:12');
        });
    });
});

