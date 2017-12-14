import { List as list } from 'immutable';
import { connect } from 'react-redux';

import { handleNaN } from '../../helpers';
import { formatSeconds } from '../../helpers/format';

import { audioSeeked } from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class AudioScrubber extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.seeking = false;
    }
    render() {
        const {
            isPlaying, bufferedRanges, progress, playTime, timeToEnd, onSeek
        } = this.props;

        const onSeekStart = evt => {
            this.seeking = true;
            onSeek(evt, true);
        };
        const onSeekIfSeeking = evt => this.seeking && onSeek(evt, true);
        const onSeekEnd = evt => {
            this.seeking = false;
            onSeek(evt, false);
        }

        const progressStyle = {
            width: `${progress}%`
        };

        const bufferedBars = bufferedRanges.map(({ left, width }, key) => {
            const style = { left, width };

            return <div key={key} className="buffered" style={style} />;
        });

        const className = classNames('audio-scrubber', { playing: isPlaying });

        return <div className={className}>
            <span className="time-played">{playTime}</span>
            <div className="trough"
                onMouseDown={onSeekStart}
                onMouseUp={onSeekEnd}
                onMouseMove={onSeekIfSeeking}
                onTouchMove={onSeekIfSeeking}
                onTouchEnd={onSeekEnd}>

                {bufferedBars}
                <div className="progress" style={progressStyle}>
                    <i className="play-head" />
                </div>
            </div>
            <span className="time-to-end">{'-'}{timeToEnd}</span>
        </div>;
    }
}

AudioScrubber.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    bufferedRanges: PropTypes.instanceOf(list).isRequired,
    progress: PropTypes.number.isRequired,
    playTime: PropTypes.string.isRequired,
    timeToEnd: PropTypes.string.isRequired,
    onSeek: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    const playTime = state.getIn(['player', 'playTime']);
    const dragTime = state.getIn(['player', 'dragTime']);

    const progressTime = dragTime === null
        ? playTime
        : dragTime;

    return {
        isPlaying: Boolean(state.getIn(['player', 'current'])),
        bufferedRanges: state.getIn(['player', 'bufferedRanges']),
        progress: 100 * handleNaN(progressTime / state.getIn(['player', 'duration'])),
        playTime: formatSeconds(Math.round(state.getIn(['player', 'playTime']))),
        timeToEnd: formatSeconds(Math.round(state.getIn(['player', 'duration']) -
            state.getIn(['player', 'playTime'])))
    };
};

const mapDispatchToProps = dispatch => ({
    onSeek: (evt, dragging) => {
        const { clientX, target } = evt;
        dispatch(audioSeeked({ dragging, clientX, target }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioScrubber);

