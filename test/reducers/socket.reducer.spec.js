import { fromJS } from 'immutable';
import { expect } from 'chai';
import * as R from '../../src/reducers/socket.reducer';

describe('Socket reducers', () => {
    it('should be fully tested');

    describe('onOpenOrClose', () => {
        it('should set socket state to open or closed', () => {
            expect(R.onOpenOrClose(fromJS({ socket: { open: false } }), true).toJS())
                .to.deep.equal({ socket: { open: true } });
            expect(R.onOpenOrClose(fromJS({ socket: { open: false } }), false).toJS())
                .to.deep.equal({ socket: { open: false } });

            expect(R.onOpenOrClose(fromJS({ socket: { open: true } }), true).toJS())
                .to.deep.equal({ socket: { open: true } });
            expect(R.onOpenOrClose(fromJS({ socket: { open: true } }), false).toJS())
                .to.deep.equal({ socket: { open: false } });
        });
    });
});

