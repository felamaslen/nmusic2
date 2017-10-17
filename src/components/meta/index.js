import AudioControls from '../../containers/audio-controls';
import AudioPlayerCore from '../../containers/audio-player-core';
import CurrentSongInfo from '../../containers/current-song-info';
import Search from '../../containers/search';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';

export default class Meta extends ImmutableComponent {
    render() {
        return <div className="audio-player-outer">
            <AudioControls visualisationEnabled={true} />
            <CurrentSongInfo />
            <Search />
            <AudioPlayerCore />
        </div>;
    }
}

