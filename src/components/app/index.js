import React from 'react';

import UIReset from '../../containers/ui-reset';
import DocumentTitle from '../../containers/document-title';
import Body from '../../containers/body';

export default function App() {
    return <div className="nmusic-app-root">
        <UIReset />
        <DocumentTitle />
        <Body />
    </div>;
}
