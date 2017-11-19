import { fromJS, List as list } from 'immutable';

export const onError = (state, err) => state
    .setIn(['cloud', 'error'], err);

export const addRemoteClient = (state, { clientId, clientState }) => state
    .setIn(['cloud', 'clients', clientId], fromJS(clientState));

export function updateClient(state, { local, clientId, clientState }) {
    if (local) {
        const reducers = [
            ['paused', (nextState, value) => nextState.setIn(['player', 'paused'], Boolean(value))]
        ];

        return reducers.reduce((nextState, [key, reducer]) => {
            if (key in clientState) {
                return reducer(nextState, clientState[key]);
            }

            return nextState;
        }, state);
    }

    return state.setIn(['cloud', 'clients', clientId], state
        .getIn(['cloud', 'clients', clientId])
        .merge(fromJS(clientState))
    );
}

export const closeRemoteClient = (state, { clientId }) => state
    .setIn(['cloud', 'clients'], state.getIn(['cloud', 'clients']).delete(clientId));

export function onUpdate(state, res) {
    try {
        const updatedClients = JSON.parse(res.data);

        return updatedClients.reduce((nextState, { type, ...client }) => {
            if (type === 'new') {
                return addRemoteClient(nextState, client);
            }
            if (type === 'update') {
                return updateClient(nextState, client);
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

export function sendUpdateToRemoteClient(state, { id, active, newState }) {
    if (!active) {
        return state;
    }

    return state.setIn(['cloud', 'newStates'], list([
        newState.set('clientId', id)
    ]));
}

