import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';

import Meta from '../../components/meta';
import Filter from '../../components/filter';
import StatusBar from '../../components/status-bar';

import EditInfo from '../edit-info';
import Sidebar from '../sidebar';
import SongList from '../song-list';

export function Body({ settingsLoaded }) {
    if (settingsLoaded) {
        return <div className="nmusic-app-outer">
            <Sidebar />
            <EditInfo />
            <div className="nmusic-body">
                <Meta />
                <Filter />
                <SongList />
                <StatusBar />
            </div>
        </div>;
    }

    return null;
}

Body.propTypes = {
    settingsLoaded: PropTypes.bool.isRequired
};

export default connect(state => ({ settingsLoaded: state.get('settingsLoaded') }))(Body);

