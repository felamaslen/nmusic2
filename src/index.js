/**
 * Entry point to the web app
 */

import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store';
import rootSaga from './sagas';

const __DEV__ = process.env.NODE_ENV === 'development';

const store = configureStore(__DEV__);
store.runSaga(rootSaga);

import App from './components/app';

import './sass/index.scss';
import './images/favicon.png';

render(
    <Provider store={store}>
        <div>
            <App />
        </div>
    </Provider>,
    document.getElementById('root')
);

