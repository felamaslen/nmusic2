/* eslint-disable id-length */

import { fromJS } from 'immutable';
import { expect } from 'chai';

import * as R from '../../../src/reducers/audio-player.reducer';
import * as M from '../../../src/constants/misc';

describe('Audio player reducer', () => {
    it('should be tested further (for queueing bug fixes)');

    describe('changeTrack', () => {
        const stateWithoutQueue = fromJS({
            player: {
                current: null,
                paused: true,
                repeat: M.REPEAT_NONE,
                shuffle: M.SHUFFLE_NONE
            },
            songList: {
                songs: [{ id: 'foo' }, { id: 'bar' }, { id: 'baz' }]
            },
            queue: {
                songs: [],
                active: -1
            }
        });

        describe('Next track', () => {
            describe('while not playing anything', () => {
                describe('if shuffle mode is set', () => {
                    it('should select the first item from the queue, if there is one', () => {
                        const stateWithQueue = stateWithoutQueue
                            .setIn(['queue', 'songs'], fromJS([{ id: 'q1' }, { id: 'q2' }]))
                            .setIn(['queue', 'active'], -1)
                            .setIn(['player', 'shuffle'], M.SHUFFLE_ALL);

                        const result = R.changeTrack(stateWithQueue, 1);

                        expect(result.getIn(['player', 'paused'])).to.equal(false);
                        expect(result.getIn(['player', 'current'])).to.equal('q1');
                    });

                    it('should select a track at random from the list, if there is a list', () => {
                        const result = R.changeTrack(stateWithoutQueue
                            .setIn(['player', 'shuffle'], M.SHUFFLE_ALL), 1);

                        expect(result.getIn(['player', 'paused'])).to.equal(false);
                    });
                });

                describe('otherwise', () => {
                    it('should select the first track', () => {
                        const result = R.changeTrack(stateWithoutQueue, 1);

                        expect(result.getIn(['player', 'paused'])).to.equal(false);
                        expect(result.getIn(['player', 'current'])).to.equal('foo');
                    });
                });
            });

            describe('while playing something', () => {
                it('should repeat the same track if set to do so', () => {
                    const stateRepeatTrack = stateWithoutQueue
                        .setIn(['player', 'current'], 'foo')
                        .setIn(['player', 'repeat'], M.REPEAT_TRACK);

                    const result = R.changeTrack(stateRepeatTrack, 1);

                    expect(result.getIn(['player', 'current'])).to.equal('foo');
                    expect(result.getIn(['player', 'paused'])).to.equal(true);

                    const resultWhilePlaying = R.changeTrack(
                        stateRepeatTrack.setIn(['player', 'paused'], false), 1
                    );

                    expect(resultWhilePlaying.getIn(['player', 'paused'])).to.equal(false);
                    expect(resultWhilePlaying.getIn(['player', 'current'])).to.equal('foo');
                });

                describe('if there is a queue', () => {
                    const stateWithQueue = stateWithoutQueue
                        .setIn(['queue', 'songs'], fromJS([{ id: 'q1' }, { id: 'q2' }]))
                        .setIn(['queue', 'active'], -1)
                        .setIn(['player', 'current'], 'foo');

                    it('should play the next item on the queue if there is one', () => {
                        const result = R.changeTrack(stateWithQueue, 1);

                        expect(result.getIn(['player', 'current'])).to.equal('q1');

                        const resultInQueue = R.changeTrack(
                            stateWithQueue
                                .setIn(['queue', 'active'], 0)
                                .setIn(['player', 'current'], 'q1'),
                            1
                        );

                        expect(resultInQueue.getIn(['player', 'current'])).to.equal('q2');
                    });
                });

                it('should play the next song on the list if there is one', () => {
                    const stateInMiddle = stateWithoutQueue
                        .setIn(['player', 'current'], 'foo');

                    const result = R.changeTrack(stateInMiddle, 1);

                    expect(result.getIn(['player', 'current'])).to.equal('bar');
                });
            });

            describe('while at end of list', () => {
                const stateAtEnd = stateWithoutQueue
                    .setIn(['player', 'current'], 'baz')
                    .setIn(['player', 'paused'], false);

                it('should stop the music if not set to repeat', () => {
                    const result = R.changeTrack(stateAtEnd, 1);

                    expect(result.getIn(['player', 'paused'])).to.equal(true);
                    expect(result.getIn(['player', 'current'])).to.equal(null);
                });

                it('should repeat from beginning if set to do so', () => {
                    const stateRepeatAll = stateAtEnd
                        .setIn(['player', 'repeat'], M.REPEAT_LIST);

                    const result = R.changeTrack(stateRepeatAll, 1);

                    expect(result.getIn(['player', 'paused'])).to.equal(false);
                    expect(result.getIn(['player', 'current'])).to.equal('foo');
                });
            });
        });

        describe('Previous track', () => {
            describe('while in the middle of a song', () => {
                const stateInMiddle = stateWithoutQueue
                    .setIn(['player', 'current'], 'bar')
                    .setIn(['player', 'playTime'], 1.51)
                    .setIn(['player', 'seekTime'], 1.51);

                it('should go to the beginning of the song', () => {
                    const result = R.changeTrack(stateInMiddle, -1);

                    expect(result.getIn(['player', 'paused'])).to.equal(true);
                    expect(result.getIn(['player', 'current'])).to.equal('bar');
                    expect(result.getIn(['player', 'seekTime'])).to.equal(-1);

                    const resultWhilePlaying = R.changeTrack(
                        stateInMiddle.setIn(['player', 'paused'], false), -1
                    );

                    expect(resultWhilePlaying.getIn(['player', 'paused'])).to.equal(false);
                    expect(resultWhilePlaying.getIn(['player', 'current'])).to.equal('bar');
                });
            });

            describe('while at beginning of song', () => {
                const stateAtBeginning = stateWithoutQueue
                    .setIn(['player', 'current'], 'bar')
                    .setIn(['player', 'playTime'], 1.49);

                const stateWithQueue = stateAtBeginning
                    .setIn(['queue', 'songs'], fromJS([{ id: 'q1' }, { id: 'q2' }]));

                it('should play the previous track in the queue if there is one', () => {
                    const result = R.changeTrack(stateWithQueue.setIn(['queue', 'active'], 1), -1);

                    expect(result.getIn(['player', 'current'])).to.equal('q1');
                });

                it('should play the last song in the list if currently at the start of the queue', () => {
                    const result = R.changeTrack(stateWithQueue.setIn(['queue', 'active'], 0), -1);

                    expect(result.getIn(['player', 'current'])).to.equal('baz');
                });

                it('should play the previous track in the list if there is one', () => {
                    const result = R.changeTrack(stateAtBeginning, -1);

                    expect(result.getIn(['player', 'paused'])).to.equal(true);
                    expect(result.getIn(['player', 'current'])).to.equal('foo');

                    const resultWhilePlaying = R.changeTrack(
                        stateAtBeginning.setIn(['player', 'paused'], false), -1
                    );

                    expect(resultWhilePlaying.getIn(['player', 'paused'])).to.equal(false);
                    expect(resultWhilePlaying.getIn(['player', 'current'])).to.equal('foo');
                });

                it('should stop the music if there isn\'t a previous track', () => {
                    const stateAtBeginningOfList = stateAtBeginning
                        .setIn(['player', 'current'], 'foo')
                        .setIn(['player', 'paused'], false);

                    const result = R.changeTrack(stateAtBeginningOfList, -1);

                    expect(result.getIn(['player', 'paused'])).to.equal(true);
                    expect(result.getIn(['player', 'current'])).to.equal(null);
                });
            });
        });
    });

    describe('setModeShuffle', () => {
        it('should set the shuffle mode', () => {
            expect(R.setModeShuffle(fromJS({ player: { foo: 'bar', shuffle: 'baz' } }), 'foo')
                .getIn(['player', 'shuffle']))
                .to.equal('foo');
        });
        it('should toggle the shuffle mode if no status was given', () => {
            expect(R.setModeShuffle(fromJS({ player: { shuffle: M.SHUFFLE_NONE } }))
                .getIn(['player', 'shuffle']))
                .to.equal(M.SHUFFLE_ALL);

            expect(R.setModeShuffle(fromJS({ player: { shuffle: M.SHUFFLE_ALL } }))
                .getIn(['player', 'shuffle']))
                .to.equal(M.SHUFFLE_NONE);
        });
    });
});

