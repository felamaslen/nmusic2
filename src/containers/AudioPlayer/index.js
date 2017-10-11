import { connect } from 'react-redux';

import { audioPlayPaused } from '../../actions/audio-player.actions';

import AudioVisualisation from './AudioVisualisation';
import AudioScrubber from './AudioScrubber';
import AudioPlayerCore from './AudioPlayerCore';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

export class AudioPlayer extends ImmutableComponent {
    render() {
        const playPauseButtonClasses = classNames({
            'button button-playpause': true,
            paused: this.props.paused,
            playing: !this.props.paused
        });

        return <div className="audio-player-outer">
            <div className="audio-player-controls-outer">
                <button className={playPauseButtonClasses}
                    onClick={() => this.props.playPause()} />
            </div>
            <div className="audio-player-scrubber-outer">
                <AudioVisualisation />
                <AudioScrubber />
            </div>
            <AudioPlayerCore />
        </div>;
    }
}

AudioPlayer.propTypes = {
    paused: PropTypes.bool.isRequired,
    playTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    playPause: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    paused: state.getIn(['global', 'player', 'paused']),
    playTime: state.getIn(['global', 'player', 'playTime']),
    duration: state.getIn(['global', 'player', 'duration'])
});

const mapDispatchToProps = dispatch => ({
    playPause: () => dispatch(audioPlayPaused())
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);

