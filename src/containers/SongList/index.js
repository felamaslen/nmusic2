import { connect } from 'react-redux';

import { songListRequested } from '../../actions/song-list.actions';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export class SongList extends PureComponent {
    componentDidMount() {
        this.props.requestList();
    }
    render() {
        const list = this.props.songs.map(song => <span key={song.id} className="song">
            <span className="title">{song.title}</span>
            <span className="duration">{song.duration}</span>
            <span className="artist">{song.artist}</span>
            <span className="album">{song.album}</span>
        </span>);

        return <div className="song-list">{list}</div>;
    }
}

SongList.propTypes = {
    songs: PropTypes.array.isRequired,
    requestList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    songs: state.global.songList.songs
});

const mapDispatchToProps = dispatch => ({
    requestList: () => dispatch(songListRequested())
});

export default connect(mapStateToProps, mapDispatchToProps)(SongList);

