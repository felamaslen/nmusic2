import { connect } from 'react-redux';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class CurrentSongInfo extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.state = {
            artworkLoading: false
        };
    }
    onArtworkLoad() {
        this.setState({
            artworkLoading: false
        });
    }
    componentDidMount() {
        if (this.props.artworkSrc) {
            this.setState({
                artworkLoading: true
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.artworkSrc !== this.props.artworkSrc) {
            this.setState({
                artworkLoading: true
            });
        }
    }
    render() {
        const artworkClasses = classNames({
            artwork: true,
            loading: this.state.artworkLoading
        });

        const onArtworkLoad = () => this.onArtworkLoad();

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
    artworkSrc: PropTypes.string
};

const mapStateToProps = state => ({
    artist: state.getIn(['player', 'currentSong', 'artist']) || null,
    album: state.getIn(['player', 'currentSong', 'album']) || null,
    title: state.getIn(['player', 'currentSong', 'title']) || null,
    artworkSrc: state.getIn(['artwork', 'src'])
});

export default connect(mapStateToProps)(CurrentSongInfo);

