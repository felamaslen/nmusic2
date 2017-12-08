import { List as list } from 'immutable';
import { connect } from 'react-redux';

import {
    filterItemClicked, filterListRequested
} from '../../actions/filter.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class FilterList extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.itemList = null;
    }
    componentDidMount() {
        this.props.loadInitialList();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.lastClickedKey !== this.props.lastClickedKey) {
            // make sure the item is scrolled into view
            const item = this.itemList.childNodes[this.props.lastClickedKey + 1];

            if (!item) {
                return;
            }

            const listTop = this.itemList.scrollTop;
            const listBottom = listTop + this.itemList.offsetHeight;

            const itemTop = item.offsetTop;
            const itemBottom = itemTop + item.offsetHeight;

            const itemVisible = itemBottom <= listBottom && itemTop >= listTop;

            if (!itemVisible) {
                this.itemList.scrollTop = itemTop - 10;
            }
        }
    }
    render() {
        const onClick = index => evt => this.props.onClick({
            shift: evt.shiftKey,
            ctrl: evt.ctrlKey,
            index
        });

        const items = this.props.items.map((item, index) => {
            const className = classNames({
                selected: this.props.selectedKeys.indexOf(index) !== -1
            });

            return <li key={item} className={className} onClick={onClick(index)}>
                {item}
            </li>;
        });

        const className = classNames({
            [`filter-section-outer filter-${this.props.filterKey}`]: true,
            loaded: this.props.loaded,
            loading: this.props.loading
        });

        const selectAllClassName = classNames({
            selected: this.props.selectedKeys.size === 0
        });

        const listRef = elem => {
            this.itemList = elem;
        };

        return <div className={className}>
            <ul ref={listRef} className="filter-list-inner">
                <li key={-1} className={selectAllClassName} onClick={onClick(-1)}>All</li>
                {items}
            </ul>
        </div>;
    }
}

FilterList.propTypes = {
    filterKey: PropTypes.string.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    items: PropTypes.instanceOf(list),
    selectedKeys: PropTypes.instanceOf(list),
    lastClickedKey: PropTypes.number.isRequired,
    loadInitialList: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
    loaded: state.getIn(['filter', ownProps.filterKey, 'loaded']),
    loading: state.getIn(['filter', ownProps.filterKey, 'loading']),
    items: state.getIn(['filter', ownProps.filterKey, 'items']),
    selectedKeys: state.getIn(['filter', ownProps.filterKey, 'selectedKeys']),
    lastClickedKey: state.getIn(['filter', ownProps.filterKey, 'lastClickedKey'])
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: evt => dispatch(filterItemClicked({ filterKey: ownProps.filterKey, ...evt })),
    loadInitialList: () => dispatch(filterListRequested(ownProps.filterKey))
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterList);

