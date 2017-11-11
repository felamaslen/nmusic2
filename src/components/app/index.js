import React from 'react';

import UIReset from '../../containers/ui-reset';
import Meta from '../meta';
import Filter from '../filter';
import SongList from '../../containers/song-list';

export default function App() {
    return <div className="nmusic-app-outer">
        <UIReset />
        <Meta />
        <Filter />
        <SongList />
    </div>;
}
