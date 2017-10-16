/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

import { AUDIO_TIME_UPDATED } from './constants/actions';
const actionsBlacklist = [
    AUDIO_TIME_UPDATED
];

import initialState from './initialState';

import rootReducer from './reducers';

export default function configureStore(__DEV__ = false) {
    const sagaMiddleware = createSagaMiddleware();

    const middleware = [sagaMiddleware];

    const devTools = __DEV__ && window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

    const composeEnhancers = devTools
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist })
        : compose;

    const enhancer = composeEnhancers(applyMiddleware(...middleware));

    const store = createStore(
        rootReducer,
        initialState,
        enhancer
    );

    if (__DEV__ && module.hot) {
        module.hot.accept('./reducers', () => {
            // eslint-disable-next-line global-require
            const nextRootReducer = require('./reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    store.runSaga = sagaMiddleware.run;
    store.close = () => store.dispatch(END);

    return store;
}

