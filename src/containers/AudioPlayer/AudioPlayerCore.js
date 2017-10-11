import { connect } from 'react-redux';

import {
    audioTimeUpdated, audioEnded, audioAnalyserUpdated
} from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

const ANALYSER_UPDATE_FREQUENCY = 100;

export class AudioPlayerCore extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.audio = null;
        this.ctx = new AudioContext();
        this.source = null;
        this.analyser = null;

        this.analyserTimer = null;

    }
    updateAnalyser() {
        clearTimeout(this.analyserTimer);

        const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

        this.analyser.getByteFrequencyData(frequencyData);

        this.props.updateAnalyser(frequencyData);

        this.analyserTimer = setTimeout(() => this.updateAnalyser(), ANALYSER_UPDATE_FREQUENCY);
    }
    createAnalyser() {
        if (!this.source) {
            this.source = this.ctx.createMediaElementSource(this.audio);

            this.analyser = this.ctx.createAnalyser();
            this.analyser.fftSize = 128;

            this.source.connect(this.analyser);
            this.source.connect(this.ctx.destination);
        }

        this.updateAnalyser();

        this.audio.play();
    }
    pause() {
        this.audio.pause();

        clearTimeout(this.analyserTimer);
        this.props.updateAnalyser(null);
    }
    play() {
        this.createAnalyser();
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
        }

        return false;
    }
    shouldComponentUpdate(nextProps) {
        const updatedAudio = this.playPauseSeek(this.props, nextProps);

        const srcChanged = this.props.src !== nextProps.src;

        return !updatedAudio && srcChanged;
    }
    componentDidUpdate(prevProps) {
        this.playPauseSeek(prevProps, this.props, true);
    }
    componentDidMount() {
        if (this.audio && !this.props.paused) {
            this.play();
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
            // this.props.onTimeUpdate(this.audio.currentTime); // TODO
        };

        const onEnded = () => this.props.onEnded();

        return <audio ref={audioRef}
            controls={false}
            src={this.props.src}
            autoPlay={false}
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
    updateAnalyser: data => dispatch(audioAnalyserUpdated(data)),
    onEnded: () => dispatch(audioEnded())
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerCore);

