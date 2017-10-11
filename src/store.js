/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';

import { AUDIO_ANALYSER_UPDATED, AUDIO_TIME_UPDATED } from './constants/actions';

import globalReducer, { analyserReducer } from './reducers';
import effectHandler from './effects';

function sideEffectHandler() {
    return store => dispatch => action => {
        dispatch(action);

        if (action.effect && action.effect.type in effectHandler) {
            const reduction = store.getState().global;

            effectHandler[action.effect.type](dispatch, reduction, action.effect.payload);
        }
    };
}

function getStore() {
    const middleware = [sideEffectHandler()];

    const devTools = process.env.NODE_ENV === 'development' &&
        window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    const actionsBlacklist = [
        AUDIO_ANALYSER_UPDATED,
        AUDIO_TIME_UPDATED
    ];

    const composeEnhancers = devTools
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist })
        : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middleware)
    );

    return createStore(
        combineReducers({
            global: globalReducer,
            analyser: analyserReducer
        }),
        enhancer
    );
}

export default getStore;

