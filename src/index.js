/**
 * Entry point to the web app
 */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import getStore from './store';
import App from './components/app';

import './sass/index.scss';
import './images/favicon.png';

const store = getStore();

function renderRoot() {
    if (process.env.NODE_ENV !== 'test') {
        render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root')
        );
    }
}

renderRoot();

