import { connect } from 'react-redux';

import { audioPlayPaused, audioTrackChanged } from '../../actions/audio-player.actions';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import VolumeControl from '../volume-control';

export function AudioControls({ paused, previous, playPause, next }) {
    const playPauseButtonClasses = classNames('button', 'button-playpause', {
        paused,
        playing: !paused
    });

    return <div className="audio-player-controls-outer">
        <div className="audio-player-controls-buttons">
            <button className="button button-previous"
                onClick={() => previous()} />

            <button className={playPauseButtonClasses}
                onClick={() => playPause()} />

            <button className="button button-next"
                onClick={() => next()} />
        </div>
        <VolumeControl />
    </div>;
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

