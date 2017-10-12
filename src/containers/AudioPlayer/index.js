import AudioControls from './AudioControls';
import AudioVisualisation from './AudioVisualisation';
import AudioScrubber from './AudioScrubber';
import AudioPlayerCore from './AudioPlayerCore';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';

import './style.scss';

export default class AudioPlayer extends ImmutableComponent {
    render() {
        return <div className="audio-player-outer">
            <AudioControls />
            <div className="audio-player-scrubber-outer">
                <AudioVisualisation />
                <AudioScrubber />
            </div>
            <AudioPlayerCore />
        </div>;
    }
}

