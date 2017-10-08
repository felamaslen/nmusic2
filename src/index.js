/**
 * Entry point to the web app
 */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import getStore from './store';
import App from './components/App';

import './images/favicon.png';

if (process.env.NODE_ENV !== 'test') {
    render(
        <Provider store={getStore()}>
            <App />
        </Provider>,
        document.getElementById('root')
    );
}

