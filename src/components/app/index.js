import React from 'react';

import UIReset from '../../containers/ui-reset';
import Sidebar from '../../containers/sidebar';
import Meta from '../meta';
import Filter from '../filter';
import SongList from '../../containers/song-list';

export default function App() {
    return <div className="nmusic-app-outer">
        <UIReset />
        <Sidebar />
        <div className="nmusic-body">
            <Meta />
            <Filter />
            <SongList />
        </div>
    </div>;
}
