import React from 'react';

import AudioPlayer from '../audio-player';
import Filter from '../../containers/filter';
import SongList from '../../containers/song-list';

import './style.scss';

export default function App() {
    return <div className="nmusic-app-outer">
        <AudioPlayer />
        <Filter />
        <SongList />
    </div>;
}
