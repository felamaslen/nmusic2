import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';

import AudioVisualisation from '../audio-visualisation';
import AudioScrubber from '../audio-scrubber';

export function CurrentSongInfo({ title, artist, album }) {
    let visualisation = null;
    if (process.env.SKIP_VISUALISER !== 'true') {
        visualisation = <AudioVisualisation />;
    }

    return <div className="current-song-info-outer">
        <span className="info">
            <span className="title">{title}</span>
            <span className="other">
                <span className="artist">{artist}</span>
                <span className="separator">{'-'}</span>
                <span className="album">{album}</span>
            </span>
        </span>
        {visualisation}
        <AudioScrubber />
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

