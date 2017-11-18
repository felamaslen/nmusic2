import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';

import Artwork from '../../components/artwork';

export function CurrentSongInfo({ title, artist, album, artworkSrc }) {
    return <div className="current-song-info-outer">
        <Artwork src={artworkSrc} />
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
    title: PropTypes.string,
    artworkSrc: PropTypes.string
};

const mapStateToProps = state => ({
    artist: state.getIn(['player', 'currentSong', 'artist']) || null,
    album: state.getIn(['player', 'currentSong', 'album']) || null,
    title: state.getIn(['player', 'currentSong', 'title']) || null,
    artworkSrc: state.getIn(['artwork', 'src'])
});

export default connect(mapStateToProps)(CurrentSongInfo);

