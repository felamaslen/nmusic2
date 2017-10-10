import { connect } from 'react-redux';

import { audioTimeUpdated, audioEnded } from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class AudioPlayerCore extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.audio = null;
        this.ctx = new AudioContext();
        this.source = null;
        this.analyser = null;
        this.frequencyData = null;

        this.analyserTimer = null;
    }
    renderFrame() {
        clearTimeout(this.analyserTimer);

        this.analyser.getByteFrequencyData(this.frequencyData);

        console.log(this.frequencyData);

        this.analyserTimer = setTimeout(() => this.renderFrame(), 1000);
    }
    createAnalyser() {
        if (!this.source) {
            this.source = this.ctx.createMediaElementSource(this.audio);

            this.analyser = this.ctx.createAnalyser();

            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

            this.source.connect(this.analyser);
            this.source.connect(this.ctx.destination);
        }

        this.renderFrame();

        this.audio.play();
    }
    pause() {
        this.audio.pause();

        clearTimeout(this.analyserTimer);
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

        const onTimeUpdate = () => this.props.onTimeUpdate(this.audio.currentTime);

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
    onEnded: () => dispatch(audioEnded())
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayerCore);

