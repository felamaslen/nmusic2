import { Component } from 'react';
import { is } from 'immutable';

export default class ImmutablePureComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const state = this.state || {};

        const propsUpdated = !(this.updateOnProps || Object.keys(nextProps))
            .every(propKey => is(nextProps[propKey], this.props[propKey]));

        if (propsUpdated) {
            return true;
        }

        const stateUpdated = !(this.updateOnStates || Object.keys(nextState || {}))
            .every(stateKey => is(nextState[stateKey], state[stateKey]));

        return stateUpdated;
    }
}

