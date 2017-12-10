import { connect } from 'react-redux';

import {
    audioTimeUpdated, audioProgressed, audioDurationSet, audioEnded, audioSourceUpdated, audioSeeked
} from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class AudioPlayerCore extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.audio = null;
        this.source = null;
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
            setTimeout(() => this.props.setDuration(this.audio.duration), 0);
        }
    }
    shouldComponentUpdate(nextProps) {
        const srcChanged = this.props.src !== nextProps.src;

        if (srcChanged) {
            return true;
        }

        this.playPauseSeek(this.props, nextProps);

        return false;
    }
    getSource() {
        if (!this.source) {
            this.source = this.props.audioContext.createMediaElementSource(this.audio);
            this.source.connect(this.props.audioContext.destination);
        }

        setTimeout(() => this.props.updateAudioSource(this.source), 0);
    }
    componentDidUpdate(prevProps) {
        if (this.audio) {
            this.audio.onloadedmetadata = () => this.setDuration();

            this.getSource();
        }
        else if (!this.props.src) {
            this.source = null;
        }

        this.playPauseSeek(prevProps, this.props, true);
    }
    componentDidMount() {
        if (this.audio && !this.props.paused) {
            this.play();

            this.getSource();
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
    audioContext: PropTypes.object,
    setDuration: PropTypes.func.isRequired,
    onProgress: PropTypes.func.isRequired,
    onTimeUpdate: PropTypes.func.isRequired,
    onEnded: PropTypes.func.isRequired,
    updateAudioSource: PropTypes.func.isRequired,
    seekToStart: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    src: state.getIn(['player', 'url']),
    paused: state.getIn(['player', 'paused']),
    seekTime: state.getIn(['player', 'seekTime']),
    audioContext: state.getIn(['player', 'audioContext'])
});

const mapDispatchToProps = dispatch => ({
    setDuration: duration => dispatch(audioDurationSet(duration)),
    onTimeUpdate: time => dispatch(audioTimeUpdated(time)),
    onProgress: (buffered, duration) => dispatch(audioProgressed({ buffered, duration })),
    updateAudioSource: source => dispatch(audioSourceUpdated(source)),
    onEnded: () => dispatch(audioEnded()),
    seekToStart: () => dispatch(audioSeeked({ raw: true, newTime: 0 }))
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerCore);

