import { connect } from 'react-redux';
import { sidebarHiddenToggled, sidebarDisplayOverToggled } from '../../actions/sidebar.actions';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SidebarTop from './sidebar-top';

import PlayQueue from '../play-queue';

export function Sidebar({ hidden, displayOver, onHideToggle, onDisplayOverToggle }) {
    const className = classNames({
        'sidebar-outer': true,
        hidden,
        'display-over': displayOver
    });

    return <div className={className}>
        <div className="inner">
            <SidebarTop onHideToggle={onHideToggle} onDisplayOverToggle={onDisplayOverToggle} />
            <div className="sidebar-body">
                <PlayQueue />
            </div>
        </div>
    </div>;
}

Sidebar.propTypes = {
    hidden: PropTypes.bool.isRequired,
    displayOver: PropTypes.bool.isRequired,
    onHideToggle: PropTypes.func.isRequired,
    onDisplayOverToggle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    hidden: state.getIn(['sidebar', 'hidden']),
    displayOver: state.getIn(['sidebar', 'displayOver'])
});

const mapDispatchToProps = dispatch => ({
    onHideToggle: () => dispatch(sidebarHiddenToggled()),
    onDisplayOverToggle: () => dispatch(sidebarDisplayOverToggled())
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

