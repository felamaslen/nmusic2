import { connect } from 'react-redux';

import { artworkLoaded } from '../../actions/audio-player.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class CurrentSongInfo extends ImmutableComponent {
    componentDidUpdate(prevProps) {
        if (prevProps.artworkSrc === this.props.artworkSrc) {
            this.props.onArtworkLoad();
        }
    }
    render() {
        const onArtworkLoad = () => this.props.onArtworkLoad();

        const artworkClasses = classNames({
            artwork: true,
            loading: this.props.artworkLoading
        });

        return <div className="current-song-info-outer">
            <span className={artworkClasses}>
                <img src={this.props.artworkSrc} onLoad={onArtworkLoad} onError={onArtworkLoad} />
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
    artist: PropTypes.string,
    album: PropTypes.string,
    title: PropTypes.string,
    artworkSrc: PropTypes.string,
    onArtworkLoad: PropTypes.func.isRequired,
    artworkLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    artist: state.getIn(['player', 'currentSong', 'artist']) || null,
    album: state.getIn(['player', 'currentSong', 'album']) || null,
    title: state.getIn(['player', 'currentSong', 'title']) || null,
    artworkSrc: state.getIn(['artwork', 'src']),
    artworkLoading: !state.getIn(['artwork', 'loaded'])
});

const mapDispatchToProps = dispatch => ({
    onArtworkLoad: () => dispatch(artworkLoaded())
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentSongInfo);

