/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux';

import { AUDIO_TIME_UPDATED } from './constants/actions';

import rootReducer from './reducers';
import effectHandler from './effects';

function sideEffectHandler() {
    return store => dispatch => action => {
        dispatch(action);

        if (action.effect && action.effect.type in effectHandler) {
            const state = store.getState();

            effectHandler[action.effect.type](dispatch, state, action.effect.payload);
        }
    };
}

function getStore() {
    const middleware = [sideEffectHandler()];

    const __DEV__ = process.env.NODE_ENV === 'development';

    const devTools = __DEV__ && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    const actionsBlacklist = [
        AUDIO_TIME_UPDATED
    ];

    const composeEnhancers = devTools
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist })
        : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middleware)
    );

    const store = createStore(rootReducer, enhancer);

    return store;
}

export default getStore;

