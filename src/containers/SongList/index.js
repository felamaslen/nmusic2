import { List as list } from 'immutable';
import { connect } from 'react-redux';

import { songListRequested } from '../../actions/song-list.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class SongList extends ImmutableComponent {
    componentDidMount() {
        this.props.requestList();
    }
    render() {
        const songList = this.props.songs.map(song => <span key={song.get('id')} className="song">
            <span className="title">{song.get('title')}</span>
            <span className="duration">{song.get('duration')}</span>
            <span className="artist">{song.get('artist')}</span>
            <span className="album">{song.get('album')}</span>
        </span>);

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

