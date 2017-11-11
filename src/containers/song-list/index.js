import { List as list } from 'immutable';
import { connect } from 'react-redux';

import { songListRequested } from '../../actions/song-list.actions';

import React from 'react';
import PropTypes from 'prop-types';

import SongListHead from './list-head';
import SongListItem from './list-item';
import SongListMenu from './menu';

export function SongList({ songs }) {
    const songList = songs.map((song, key) => <SongListItem
        key={song.get('id')} listKey={key} id={song.get('id')} />
    );

    return <div className="song-list-outer">
        <SongListHead />
        <div className="song-list">{songList}</div>
        <SongListMenu />
    </div>;
}

SongList.propTypes = {
    songs: PropTypes.instanceOf(list).isRequired,
    requestList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    songs: state.getIn(['songList', 'songs'])
});

const mapDispatchToProps = dispatch => ({
    requestList: () => dispatch(songListRequested())
});

export default connect(mapStateToProps, mapDispatchToProps)(SongList);

