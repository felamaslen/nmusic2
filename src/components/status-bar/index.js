import React from 'react';

import ShuffleToggleButton from '../../containers/shuffle-toggle-button';

export default function StatusBar() {
    return <div className="status-bar-outer">
        <ShuffleToggleButton />
    </div>;
}

StatusBar.propTypes = {
};

