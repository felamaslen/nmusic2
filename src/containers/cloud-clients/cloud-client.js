import { Map as map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

export default function CloudClient({ client }) {
    return <li className="cloud-client">
        <span className="origin">{client.get('origin')}</span>
        <span className="info">
            <span className="title">
                {client.getIn(['currentSong', 'title'])}
            </span>
        </span>
    </li>;
}

CloudClient.propTypes = {
    client: PropTypes.instanceOf(map).isRequired
};

