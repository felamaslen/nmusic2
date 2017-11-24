import { connect } from 'react-redux';
import { audioShuffleSet } from '../../actions/audio-player.actions';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SHUFFLE_ALL } from '../../constants/misc';

export function ShuffleToggleButton({ active, onToggle }) {
    const className = classNames({
        'shuffle-toggle-button': true,
        active
    });

    return <div className={className}>
        <button onClick={onToggle}>{'Toggle'}</button>
    </div>;
}

ShuffleToggleButton.propTypes = {
    active: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    active: state.getIn(['player', 'shuffle']) === SHUFFLE_ALL
});

const mapDispatchToProps = dispatch => ({
    onToggle: () => dispatch(audioShuffleSet())
});

export default connect(mapStateToProps, mapDispatchToProps)(ShuffleToggleButton);

