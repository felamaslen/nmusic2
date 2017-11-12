import { Map as map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function CloudClient({ client }) {
    const active = Boolean(client.get('currentSong'));

    const className = classNames({
        'cloud-client': true,
        active
    });

    return <li className={className}>
        <h4 className="origin">{client.get('origin')}</h4>
        <span className="info">
            <span className="title">
                {client.getIn(['currentSong', 'title'])}
            </span>
            <span className="artist">
                {client.getIn(['currentSong', 'artist'])}
            </span>
            <span className="album">
                {client.getIn(['currentSong', 'album'])}
            </span>
        </span>
    </li>;
}

CloudClient.propTypes = {
    client: PropTypes.instanceOf(map).isRequired
};

