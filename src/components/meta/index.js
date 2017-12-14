import AudioControls from '../../containers/audio-controls';
import AudioPlayerCore from '../../containers/audio-player-core';
import CurrentSongInfo from '../../containers/current-song-info';
import Search from '../../containers/search';

import React from 'react';

export default function Meta() {
    return <div className="audio-player-outer">
        <AudioControls />
        <CurrentSongInfo />
        <Search />
        <AudioPlayerCore />
    </div>;
}

