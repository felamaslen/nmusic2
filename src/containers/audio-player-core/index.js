import { connect } from 'react-redux';

import {
    audioTimeUpdated, audioProgressed, audioDurationSet, audioEnded, audioNodeUpdated, audioSeeked
} from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class AudioPlayerCore extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.audio = null;
    }
    pause() {
        this.audio.pause();
    }
    play() {
        this.audio.play();
    }
    playPauseSeek(prevProps, nextProps, updated = false) {
        if (this.audio) {
            if ((updated || !prevProps.paused) && nextProps.paused) {
                this.pause();

                return true;
            }
            if ((updated || prevProps.paused) && !nextProps.paused) {
                this.play();

                return true;
            }
            if (prevProps.seekTime !== nextProps.seekTime) {
                this.audio.currentTime = nextProps.seekTime;

                return true;
            }
            if (nextProps.seekTime < 0) {
                this.props.seekToStart();
            }
        }

        return false;
    }
    setDuration() {
        if (this.audio) {
            this.props.setDuration(this.audio.duration);
        }
    }
    shouldComponentUpdate(nextProps) {
        const srcChanged = this.props.src !== nextProps.src;

        if (srcChanged) {
            return true;
        }

        const updatedAudio = this.playPauseSeek(this.props, nextProps);

        return !updatedAudio;
    }
    componentDidUpdate(prevProps) {
        if (this.audio) {
            this.audio.onloadedmetadata = () => this.setDuration();

            this.props.updateAudioNode(this.audio);
        }

        this.playPauseSeek(prevProps, this.props, true);
    }
    componentDidMount() {
        if (this.audio && !this.props.paused) {
            this.play();

            this.props.updateAudioNode(this.audio);
        }
    }
    render() {
        if (!this.props.src) {
            return null;
        }

        const audioRef = audio => {
            this.audio = audio;
        };

        const onTimeUpdate = () => {
            this.props.onTimeUpdate(this.audio.currentTime);
        };

        const onProgress = () => {
            this.props.onProgress(this.audio.buffered, this.audio.duration);
        };

        const onEnded = () => this.props.onEnded();

        return <audio ref={audioRef}
            controls={false}
            src={this.props.src}
            autoPlay={false}
            onTimeUpdate={onTimeUpdate}
            onProgress={onProgress}
            onEnded={onEnded}
        />;
    }
}

AudioPlayerCore.propTypes = {
    src: PropTypes.string,
    paused: PropTypes.bool.isRequired,
    seekTime: PropTypes.number.isRequired,
    setDuration: PropTypes.func.isRequired,
    onProgress: PropTypes.func.isRequired,
    onTimeUpdate: PropTypes.func.isRequired,
    onEnded: PropTypes.func.isRequired,
    updateAudioNode: PropTypes.func.isRequired,
    seekToStart: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    src: state.getIn(['player', 'url']),
    paused: state.getIn(['player', 'paused']),
    seekTime: state.getIn(['player', 'seekTime'])
});

const mapDispatchToProps = dispatch => ({
    setDuration: duration => dispatch(audioDurationSet(duration)),
    onTimeUpdate: time => dispatch(audioTimeUpdated(time)),
    onProgress: (buffered, duration) => dispatch(audioProgressed({ buffered, duration })),
    updateAudioNode: audioNode => dispatch(audioNodeUpdated(audioNode)),
    onEnded: () => dispatch(audioEnded()),
    seekToStart: () => dispatch(audioSeeked({ raw: true, newTime: 0 }))
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerCore);

