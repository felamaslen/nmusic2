import React from 'react';

import AudioPlayer from '../../containers/AudioPlayer';
import SongList from '../../containers/SongList';

import './style.scss';

export default function App() {
    return <div className="nmusic-app-outer">
        <AudioPlayer />
        <SongList />
    </div>;
}
