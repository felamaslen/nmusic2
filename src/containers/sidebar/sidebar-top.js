import React from 'react';
import PropTypes from 'prop-types';

export default function SidebarTop({ onHideToggle, onDisplayOverToggle }) {
    return <div className="sidebar-top-outer">
        <a onClick={onDisplayOverToggle} className="button-sidebar-display-toggle">
            <div className="bars" />
        </a>
        <a onClick={onHideToggle} className="button-sidebar-toggle">
            <div className="bars" />
        </a>
    </div>;
}

SidebarTop.propTypes = {
    onHideToggle: PropTypes.func.isRequired,
    onDisplayOverToggle: PropTypes.func.isRequired
};

