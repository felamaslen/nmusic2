import AudioControls from '../../containers/audio-controls';
import AudioVisualisation from '../../containers/audio-visualisation';
import AudioScrubber from '../../containers/audio-scrubber';
import AudioPlayerCore from '../../containers/audio-player-core';
import CurrentSongInfo from '../../containers/current-song-info';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';

export default class AudioPlayer extends ImmutableComponent {
    render() {
        return <div className="audio-player-outer">
            <AudioControls />
            <CurrentSongInfo />
            <div className="audio-player-scrubber-outer">
                <AudioVisualisation />
                <AudioScrubber />
            </div>
            <AudioPlayerCore />
        </div>;
    }
}

