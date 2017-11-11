import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import {
    songListItemClicked, songListQueueAdded, songListMenuOpened
} from '../../../actions/song-list.actions';
import { audioFileLoaded } from '../../../actions/audio-player.actions';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export function SongListItem(props) {
    const {
        song,
        selected,
        current,
        paused,
        listKey,
        selectSong,
        playSong,
        openMenu
    } = props;

    const className = classNames({
        song: true,
        selected,
        current,
        paused
    });

    const onSelect = evt => {
        selectSong({
            index: listKey,
            ctrl: evt.ctrlKey,
            shift: evt.shiftKey
        });
    };
    const onPlay = () => playSong(song);
    const onMenu = evt => {
        openMenu(song, evt.clientX, evt.clientY);

        evt.preventDefault();
    };

    return <span key={song.get('id')} className={className}
        onMouseDown={onSelect}
        onDoubleClick={onPlay}
        onContextMenu={onMenu}>

        <span className="status" />
        <span className="track">{song.get('trackNo')}</span>
        <span className="title">{song.get('title')}</span>
        <span className="duration">{song.get('durationFormatted')}</span>
        <span className="artist">{song.get('artist')}</span>
        <span className="album">{song.get('album')}</span>
    </span>;
}

SongListItem.propTypes = {
    song: PropTypes.instanceOf(map).isRequired,
    selected: PropTypes.bool.isRequired,
    current: PropTypes.bool.isRequired,
    paused: PropTypes.bool.isRequired,
    listKey: PropTypes.number.isRequired,
    selectSong: PropTypes.func.isRequired,
    playSong: PropTypes.func.isRequired,
    openMenu: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
    const current = state.getIn(['player', 'current']) === ownProps.id;
    const paused = current && state.getIn(['player', 'paused']);

    return {
        song: state.getIn(['songList', 'songs', ownProps.listKey]),
        selected: state
            .getIn(['songList', 'selectedIds'])
            .indexOf(ownProps.id) !== -1,
        current,
        paused
    };
};

const mapDispatchToProps = dispatch => ({
    selectSong: req => dispatch(songListItemClicked(req)),
    playSong: song => dispatch(audioFileLoaded(song)),
    openMenu: (song, posX, posY) => dispatch(songListMenuOpened({ song, posX, posY }))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongListItem);

