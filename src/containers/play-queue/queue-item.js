import { Map as map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function QueueItem({ song, active, itemKey }) {
    const className = classNames({
        'play-queue-song': true,
        active
    });

    return <li className={className}>
        <span className="list-key">{itemKey + 1}{'.'}</span>
        <span className="info">
            <span className="title">{song.get('title')}</span>
            <span className="artist">{song.get('artist')}</span>
            <span className="album">{song.get('album') || 'Unknown album'}</span>
        </span>
    </li>;
}

QueueItem.propTypes = {
    song: PropTypes.instanceOf(map).isRequired,
    active: PropTypes.bool.isRequired,
    itemKey: PropTypes.number.isRequired
};

