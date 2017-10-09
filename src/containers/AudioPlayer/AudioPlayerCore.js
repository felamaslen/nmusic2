import { connect } from 'react-redux';

import { audioTimeUpdated, audioEnded } from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class AudioPlayerCore extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.audio = null;
    }
    shouldComponentUpdate(nextProps) {
        if (this.audio) {
            if (!this.props.paused && nextProps.paused) {
                this.audio.pause();

                return false;
            }
            if (this.props.paused && !nextProps.paused) {
                this.audio.play();

                return false;
            }
            if (this.props.seekTime !== nextProps.seekTime) {
                this.audio.currentTime = nextProps.seekTime;

                return false;
            }
        }

        return super.shouldComponentUpdate(nextProps);
    }
    render() {
        if (!this.props.src) {
            return null;
        }

        const audioRef = audio => {
            this.audio = audio;
        };

        const onTimeUpdate = () => this.props.onTimeUpdate(this.audio.currentTime);

        const onEnded = () => this.props.onEnded();

        return <audio ref={audioRef}
            controls={false}
            src={this.props.src}
            autoPlay={!this.props.paused}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
        />;
    }
}

AudioPlayerCore.propTypes = {
    src: PropTypes.string,
    paused: PropTypes.bool.isRequired,
    seekTime: PropTypes.number.isRequired,
    onTimeUpdate: PropTypes.func.isRequired,
    onEnded: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    src: state.getIn(['global', 'player', 'url']),
    paused: state.getIn(['global', 'player', 'paused']),
    seekTime: state.getIn(['global', 'player', 'seekTime'])
});

const mapDispatchToProps = dispatch => ({
    onTimeUpdate: time => dispatch(audioTimeUpdated(time)),
    onEnded: () => dispatch(audioEnded())
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerCore);

