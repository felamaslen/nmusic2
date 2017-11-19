import { Map as map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function CloudClient({ client, onUpdate }) {
    const active = Boolean(client.get('currentSong'));
    const paused = Boolean(client.get('paused'));

    const className = classNames({
        'cloud-client': true,
        [`client-${client.get('id')}`]: true,
        active,
        paused,
        playing: active && !paused
    });

    const onTogglePause = () => onUpdate(client.get('id'), active, map({
        paused: !paused
    }));

    return <li className={className}>
        <h4 className="origin">{client.get('origin')}</h4>
        <div className="info-outer">
            <div className="play-pause" onClick={onTogglePause}>
                <i className="status" />
            </div>
            <div className="info">
                <span className="title">
                    {client.getIn(['currentSong', 'title'])}
                </span>
                <span className="artist">
                    {client.getIn(['currentSong', 'artist'])}
                </span>
                <span className="album">
                    {client.getIn(['currentSong', 'album'])}
                </span>
            </div>
        </div>
    </li>;
}

CloudClient.propTypes = {
    client: PropTypes.instanceOf(map).isRequired,
    onUpdate: PropTypes.func.isRequired
};

