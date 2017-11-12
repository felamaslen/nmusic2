import { fromJS } from 'immutable';

export const onError = (state, err) => state
    .setIn(['cloud', 'error'], err);

export const addRemoteClient = (state, { clientId, clientState }) => state
    .setIn(['cloud', 'clients', clientId], fromJS(clientState));

export const updateRemoteClient = (state, { clientId, clientState }) => state
    .setIn(['cloud', 'clients', clientId], state
        .getIn(['cloud', 'clients', clientId])
        .merge(fromJS(clientState))
    );

export const closeRemoteClient = (state, { clientId }) => state
    .setIn(['cloud', 'clients'], state.getIn(['cloud', 'clients']).delete(clientId));

export function onUpdate (state, res) {
    try {
        const updatedClients = JSON.parse(res.data);

        return updatedClients.reduce((nextState, { type, ...client }) => {
            if (type === 'new') {
                return addRemoteClient(nextState, client);
            }
            if (type === 'update') {
                return updateRemoteClient(nextState, client);
            }
            if (type === 'close') {
                return closeRemoteClient(nextState, client);
            }

            return nextState;

        }, state);
    }
    catch (err) {
        return state;
    }
}

