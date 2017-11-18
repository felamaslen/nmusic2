import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';

export function CurrentSongInfo({ title, artist, album }) {
    return <div className="current-song-info-outer">
        <span className="info">
            <span className="title">{title}</span>
            <span className="artist">{artist}</span>
            <span className="album">{album}</span>
        </span>
    </div>;
}

CurrentSongInfo.propTypes = {
    artist: PropTypes.string,
    album: PropTypes.string,
    title: PropTypes.string
};

const mapStateToProps = state => ({
    artist: state.getIn(['player', 'currentSong', 'artist']) || null,
    album: state.getIn(['player', 'currentSong', 'album']) || null,
    title: state.getIn(['player', 'currentSong', 'title']) || null
});

export default connect(mapStateToProps)(CurrentSongInfo);

