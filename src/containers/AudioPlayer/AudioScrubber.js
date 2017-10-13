import { connect } from 'react-redux';

import { handleNaN } from '../../helpers';

import { audioSeeked } from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class AudioScrubber extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.seeking = false;
    }
    render() {
        const onSeekStart = evt => {
            this.seeking = true;
            this.props.onSeek(evt, true);
        };
        const onSeek = evt => this.seeking && this.props.onSeek(evt, true);
        const onSeekEnd = evt => {
            this.seeking = false;
            this.props.onSeek(evt, false);
        }

        const progressStyle = {
            width: `${this.props.progress}%`
        };

        return <div className="audio-scrubber">
            <div className="trough"
                onMouseDown={onSeekStart}
                onMouseUp={onSeekEnd}
                onMouseMove={onSeek}
                onTouchMove={onSeek}
                onTouchEnd={onSeekEnd}>

                <div className="progress" style={progressStyle}>
                    <i className="play-head" />
                </div>
            </div>
        </div>;
    }
}

AudioScrubber.propTypes = {
    progress: PropTypes.number.isRequired
};

const mapStateToProps = state => {
    const playTime = state.getIn(['global', 'player', 'playTime']);
    const dragTime = state.getIn(['global', 'player', 'dragTime']);

    const progressTime = dragTime === null
        ? playTime
        : dragTime;

    return {
        progress: 100 * handleNaN(progressTime / state.getIn(['global', 'player', 'duration']))
    };
};

const mapDispatchToProps = dispatch => ({
    onSeek: (evt, dragging) => {
        const { clientX, target } = evt;
        dispatch(audioSeeked({ dragging, clientX, target }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioScrubber);

