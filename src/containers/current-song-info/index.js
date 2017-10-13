import { connect } from 'react-redux';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

import './style.scss';

export class CurrentSongInfo extends ImmutableComponent {
    render() {
        if (!this.props.active) {
            return null;
        }

        return <div className="current-song-info-outer">
            <span className="title">{this.props.title}</span>
            <span className="artist">{this.props.artist}</span>
            <span className="album">{this.props.album}</span>
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
    active: Boolean(state.getIn(['global', 'player', 'current'])),
    artist: state.getIn(['global', 'player', 'currentSong', 'artist']),
    ablum: state.getIn(['global', 'player', 'currentSong', 'album']),
    title: state.getIn(['global', 'player', 'currentSong', 'title'])
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSongInfo);

