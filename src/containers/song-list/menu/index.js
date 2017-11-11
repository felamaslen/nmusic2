import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import { songListQueueAdded } from '../../../actions/song-list.actions';

import React from 'react';
import PureComponent from '../../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class SongListMenu extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { removed: true };
        this.removeTimer = null;
    }
    componentDidUpdate(prevProps) {
        if (this.removeTimer) {
            clearTimeout(this.removeTimer);
        }

        if (prevProps.hidden && !this.props.hidden && this.state.removed) {
            this.setState({ removed: false });
        }
        else if (!prevProps.hidden && this.props.hidden && !this.state.removed) {
            this.removeTimer = setTimeout(() => {
                this.setState({ removed: true });
            }, 350);
        }
    }
    render() {
        const { hidden, posX, posY, addToQueue } = this.props;

        const menuStyle = {
            left: posX,
            top: posY
        };

        const onAddToQueue = evt => {
            evt.nativeEvent.stopImmediatePropagation();

            addToQueue();
        }

        const className = classNames({
            menu: true,
            hidden,
            removed: this.state.removed
        });

        return <div className={className} style={menuStyle}>
            <ul className="menu-list">
                <li className="menu-link" onMouseDown={onAddToQueue}>{'Add to queue'}</li>
            </ul>
        </div>;
    }
}

SongListMenu.propTypes = {
    hidden: PropTypes.bool.isRequired,
    song: PropTypes.instanceOf(map),
    posX: PropTypes.number,
    posY: PropTypes.number,
    addToQueue: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    hidden: state.getIn(['songList', 'menu', 'hidden']),
    song: state.getIn(['songList', 'menu', 'song']),
    posX: state.getIn(['songList', 'menu', 'posX']),
    posY: state.getIn(['songList', 'menu', 'posY'])
});

const mapDispatchToProps = dispatch => ({
    addToQueue: () => dispatch(songListQueueAdded())
});

export default connect(mapStateToProps, mapDispatchToProps)(SongListMenu);

