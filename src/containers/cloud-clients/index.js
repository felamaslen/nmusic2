import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import { remoteClientUpdated } from '../../actions/socket.actions';

import React from 'react';
import PropTypes from 'prop-types';

import CloudClient from './cloud-client';

export function CloudClients({ clients, onUpdate }) {
    const clientsList = clients
        .map((client, id) => client.set('id', id))
        .toList()
        .map(client =>
            <CloudClient key={client.get('id')} client={client} onUpdate={onUpdate} />);

    return <div className="cloud-clients-outer">
        <h3 className="sidebar-title cloud-clients-title">
            {'Other clients'}
        </h3>
        <ul className="cloud-clients">
            {clientsList}
        </ul>
    </div>;
}

CloudClients.propTypes = {
    clients: PropTypes.instanceOf(map).isRequired,
    onUpdate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    clients: state.getIn(['cloud', 'clients'])
});

const mapDispatchToProps = dispatch => ({
    onUpdate: (id, active, newState) => dispatch(remoteClientUpdated({ id, active, newState }))
});

export default connect(mapStateToProps, mapDispatchToProps)(CloudClients);

