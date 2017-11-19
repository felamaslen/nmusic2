import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Meta from '../../components/meta';
import Filter from '../../components/filter';

import Sidebar from '../sidebar';
import SongList from '../song-list';

export function Body({ settingsLoaded, artistSelected, albumSelected }) {
    if (settingsLoaded) {
        const className = classNames({
            'nmusic-app-outer': true,
            'needs-artist': !artistSelected,
            'needs-album': artistSelected && !albumSelected,
            'display-songs': artistSelected && albumSelected
        });

        return <div className={className}>
            <Sidebar />
            <div className="nmusic-body">
                <Meta />
                <Filter />
                <SongList />
            </div>
        </div>;
    }

    return null;
}

Body.propTypes = {
    settingsLoaded: PropTypes.bool.isRequired,
    artistSelected: PropTypes.bool.isRequired,
    albumSelected: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    settingsLoaded: state.get('settingsLoaded'),
    artistSelected: state.getIn(['filter', 'artist', 'selectedKeys']).size === 1,
    albumSelected: state.getIn(['filter', 'album', 'selectedKeys']).size === 1 ||
        state.getIn(['filter', 'album', 'allSelected'])
});

export default connect(mapStateToProps)(Body);

