/* eslint-disable no-underscore-dangle, global-require */
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { createLogger } from 'redux-logger';
import * as actions from '../constants/actions';

import rootSaga from '../sagas';
import rootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();

const SKIP_LOG_ACTIONS = [
    actions.AUDIO_TIME_UPDATED,
    actions.UI_RESET,
    actions.AUDIO_SEEKED
];

const logger = createLogger({
    collapsed: true,
    predicate: (getState, action) => SKIP_LOG_ACTIONS.indexOf(action.type) === -1
});

const newStore = initialState => {
    const createStoreWithMiddleware = compose(
        applyMiddleware(sagaMiddleware, logger)
    )(createStore);

    const store = createStoreWithMiddleware(
        rootReducer,
        initialState,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
            actionsBlacklist: SKIP_LOG_ACTIONS
        })
    );

    let sagaTask = sagaMiddleware.run(function *getSagas() {
        yield rootSaga();
    });

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            store.replaceReducer(require('../reducers').default);
        });

        module.hot.accept('../sagas', () => {
            const getNewSagas = require('../sagas').default;

            sagaTask.cancel();
            sagaTask.done.then(() => {
                sagaTask = sagaMiddleware.run(function *replacedSaga() {
                    yield getNewSagas();
                });
            });
        });
    }

    return store;
};

export default newStore;
