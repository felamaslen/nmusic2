import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';

import CloudClient from './cloud-client';

export function CloudClients({ clients }) {
    const clientsList = clients
        .map((client, id) => client.set('id', id))
        .toList()
        .map(client =>
            <CloudClient key={client.get('id')} client={client} />);

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
    clients: PropTypes.instanceOf(map).isRequired
};

const mapStateToProps = state => ({
    clients: state.getIn(['cloud', 'clients'])
});

export default connect(mapStateToProps)(CloudClients);

