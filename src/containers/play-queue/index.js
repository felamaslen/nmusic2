import { List as list } from 'immutable';
import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';

import QueueItem from './queue-item';

export function PlayQueue({ queue, active }) {
    const queueItems = queue.map(
        (item, itemKey) => <QueueItem key={itemKey} active={active === itemKey} song={item}
            itemKey={itemKey} />
    );

    return <div className="play-queue-outer">
        <h3 className="play-queue-title">{'Play queue'}</h3>
        <ul className="play-queue">
            {queueItems}
        </ul>
    </div>;
}

PlayQueue.propTypes = {
    queue: PropTypes.instanceOf(list).isRequired,
    active: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
    queue: state.getIn(['queue', 'songs']),
    active: state.getIn(['queue', 'active'])
});

export default connect(mapStateToProps)(PlayQueue);

