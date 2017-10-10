import { List as list } from 'immutable';
import { connect } from 'react-redux';

import {
    songListRequested, songListSorted
} from '../../actions/song-list.actions';

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

        return <div className="song-list-outer">
            <span className="song-list-head">
                <span className="title" onClick={() => this.props.sortList('title')}>Title</span>
                <span className="duration">Duration</span>
                <span className="artist" onClick={() => this.props.sortList('artist')}>Artist</span>
                <span className="album" onClick={() => this.props.sortList('album')}>Album</span>
            </span>
            <div className="song-list">{songList}</div>
        </div>;
    }
}

SongList.propTypes = {
    songs: PropTypes.instanceOf(list).isRequired,
    requestList: PropTypes.func.isRequired,
    sortList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    songs: state.getIn(['global', 'songList', 'songs'])
});

const mapDispatchToProps = dispatch => ({
    requestList: () => dispatch(songListRequested()),
    sortList: key => dispatch(songListSorted(key))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongList);

