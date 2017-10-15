import AudioControls from '../../containers/audio-controls';
import AudioPlayerCore from '../../containers/audio-player-core';
import CurrentSongInfo from '../../containers/current-song-info';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';

export default class AudioPlayer extends ImmutableComponent {
    render() {
        return <div className="audio-player-outer">
            <AudioControls visualisationEnabled={true} />
            <CurrentSongInfo />
            <AudioPlayerCore />
        </div>;
    }
}

