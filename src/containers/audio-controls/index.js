import { connect } from 'react-redux';

import {
    audioPlayPaused, audioTrackChanged
} from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AudioScrubber from '../audio-scrubber';
import AudioVisualisation from '../audio-visualisation';

import './style.scss';

export class AudioControls extends ImmutableComponent {
    render() {
        const playPauseButtonClasses = classNames({
            'button button-playpause': true,
            paused: this.props.paused,
            playing: !this.props.paused
        });

        let visualisation = null;
        if (this.props.visualisationEnabled) {
            visualisation = <AudioVisualisation />;
        }

        return <div className="audio-player-controls-outer">
            <div className="audio-player-controls-buttons">
                <button className="button button-previous"
                    onClick={() => this.props.previous()} />

                <button className={playPauseButtonClasses}
                    onClick={() => this.props.playPause()} />

                <button className="button button-next"
                    onClick={() => this.props.next()} />
            </div>
            <AudioScrubber />
            {visualisation}
        </div>;
    }
}

AudioControls.propTypes = {
    paused: PropTypes.bool.isRequired,
    playPause: PropTypes.func.isRequired,
    previous: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    paused: state.getIn(['player', 'paused'])
});

const mapDispatchToProps = dispatch => ({
    playPause: () => dispatch(audioPlayPaused()),
    previous: () => dispatch(audioTrackChanged(-1)),
    next: () => dispatch(audioTrackChanged(1))
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioControls);

