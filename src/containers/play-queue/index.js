import { List as list } from 'immutable';

import { connect } from 'react-redux';

import { songListQueueOrdered } from '../../actions/song-list.actions';

import React from 'react';
import PropTypes from 'prop-types';

import QueueItem from '../../components/play-queue-item';
import SortableList from '../../components/sortable-list';

export function PlayQueue({ queue, active, onOrderQueue }) {
    const itemProps = (item, itemKey, dragging) => ({
        itemKey,
        active: active === itemKey && !dragging,
        song: item
    });

    const itemKey = item => item.get('id');

    return <div className="play-queue-outer">
        <h3 className="sidebar-title play-queue-title">{'Play queue'}</h3>
        <SortableList
            className="play-queue"
            ListItem={QueueItem}
            childProps={itemProps}
            childKey={itemKey}
            onOrder={onOrderQueue}
        >
            {queue}
        </SortableList>
    </div>;
}

PlayQueue.propTypes = {
    queue: PropTypes.instanceOf(list).isRequired,
    active: PropTypes.number.isRequired,
    onOrderQueue: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    queue: state.getIn(['queue', 'songs']),
    active: state.getIn(['queue', 'active'])
});

const mapDispatchToProps = dispatch => ({
    onOrderQueue: (clicked, delta) => dispatch(songListQueueOrdered({ clicked, delta }))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayQueue);

