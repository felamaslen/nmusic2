/**
 * Entry point to the web app
 */

import React from 'react';
import { render } from 'react-dom';

if (process.env.NODE_ENV !== 'test') {
    render(
        <h1>It works!</h1>,
        document.getElementById('root')
    );
}

