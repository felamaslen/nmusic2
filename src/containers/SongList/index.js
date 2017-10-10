import { List as list } from 'immutable';
import { connect } from 'react-redux';

import { songListRequested } from '../../actions/song-list.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

import './style.scss';

import SongListItem from './SongListItem';

export class SongList extends ImmutableComponent {
    componentDidMount() {
        this.props.requestList();
    }
    render() {
        const songList = this.props.songs.map((song, key) => <SongListItem
            key={song.get('id')} listKey={key} id={song.get('id')} />
        );

        return <div className="song-list">{songList}</div>;
    }
}

SongList.propTypes = {
    songs: PropTypes.instanceOf(list).isRequired,
    requestList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    songs: state.getIn(['global', 'songList', 'songs'])
});

const mapDispatchToProps = dispatch => ({
    requestList: () => dispatch(songListRequested())
});

export default connect(mapStateToProps, mapDispatchToProps)(SongList);

