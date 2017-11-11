import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import { songListQueueAdded } from '../../../actions/song-list.actions';

import React from 'react';
import PropTypes from 'prop-types';

export function SongListMenu({ active, song, posX, posY, addToQueue }) {
    if (!active) {
        return <div className="menu menu-hidden" />;
    }

    const menuStyle = {
        left: posX,
        top: posY
    };

    const onAddToQueue = evt => {
        evt.nativeEvent.stopImmediatePropagation();

        addToQueue(song);
    }

    return <div className="menu" style={menuStyle}>
        <ul className="menu-list">
            <li className="menu-link" onMouseDown={onAddToQueue}>{'Add to queue'}</li>
        </ul>
    </div>;
}

SongListMenu.propTypes = {
    active: PropTypes.bool.isRequired,
    song: PropTypes.instanceOf(map),
    posX: PropTypes.number,
    posY: PropTypes.number,
    addToQueue: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    active: Boolean(state.getIn(['songList', 'menu'])),
    song: state.getIn(['songList', 'menu', 'song']),
    posX: state.getIn(['songList', 'menu', 'posX']),
    posY: state.getIn(['songList', 'menu', 'posY'])
});

const mapDispatchToProps = dispatch => ({
    addToQueue: song => dispatch(songListQueueAdded(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongListMenu);

