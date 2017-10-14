import { connect } from 'react-redux';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

import './style.scss';

function encodeArtistAlbum(artist, album) {
    return Buffer.from(`${artist}/${album}`).toString('base64');
}

export class CurrentSongInfo extends ImmutableComponent {
    render() {
        if (!this.props.active) {
            return null;
        }

        const artwork = `api/v1/artwork/${encodeArtistAlbum(this.props.artist, this.props.album)}`;

        return <div className="current-song-info-outer">
            <span className="artwork">
                <img src={artwork} />
            </span>
            <span className="info">
                <span className="title">{this.props.title}</span>
                <span className="artist">{this.props.artist}</span>
                <span className="album">{this.props.album}</span>
            </span>
        </div>;
    }
}

CurrentSongInfo.propTypes = {
    active: PropTypes.bool.isRequired,
    artist: PropTypes.string,
    album: PropTypes.string,
    title: PropTypes.string
};

const mapStateToProps = state => ({
    active: Boolean(state.getIn(['player', 'current'])),
    artist: state.getIn(['player', 'currentSong', 'artist']),
    album: state.getIn(['player', 'currentSong', 'album']),
    title: state.getIn(['player', 'currentSong', 'title'])
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSongInfo);

