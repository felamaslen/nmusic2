import React from 'react';

import AudioPlayer from '../audio-player';
import SongList from '../../containers/song-list';

import './style.scss';

export default function App() {
    return <div className="nmusic-app-outer">
        <AudioPlayer />
        <SongList />
    </div>;
}
