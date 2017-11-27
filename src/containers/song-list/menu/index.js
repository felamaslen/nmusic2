import { connect } from 'react-redux';

import { songListQueueAdded } from '../../../actions/song-list.actions';
import { editInfoOpened } from '../../../actions/edit-info.actions';

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
        const { hidden, posX, posY, addToQueue, edit } = this.props;

        const menuStyle = {
            left: posX,
            top: posY
        };

        const stopEvent = callback => evt => {
            if (evt && evt.nativeEvent) {
                evt.nativeEvent.stopImmediatePropagation();
            }

            callback();
        };

        const onAddToQueue = stopEvent(addToQueue);

        const onEdit = stopEvent(edit);

        const className = classNames({
            menu: true,
            hidden,
            removed: this.state.removed
        });

        return <div className={className} style={menuStyle}>
            <ul className="menu-list">
                <li className="menu-link" onMouseDown={onAddToQueue}>{'Add to queue'}</li>
                <li className="menu-link" onMouseDown={onEdit}>{'Edit'}</li>
            </ul>
        </div>;
    }
}

SongListMenu.propTypes = {
    hidden: PropTypes.bool.isRequired,
    posX: PropTypes.number,
    posY: PropTypes.number,
    addToQueue: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    hidden: state.getIn(['songList', 'menu', 'hidden']),
    posX: state.getIn(['songList', 'menu', 'posX']),
    posY: state.getIn(['songList', 'menu', 'posY'])
});

const mapDispatchToProps = dispatch => ({
    addToQueue: () => dispatch(songListQueueAdded()),
    edit: () => dispatch(editInfoOpened())
});

export default connect(mapStateToProps, mapDispatchToProps)(SongListMenu);

