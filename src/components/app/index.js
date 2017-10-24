import React from 'react';

import Meta from '../meta';
import Filter from '../filter';
import SongList from '../../containers/song-list';

export default function App() {
    return <div className="nmusic-app-outer">
        <Meta />
        <Filter />
        <SongList />
    </div>;
}
