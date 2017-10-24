import { connect } from 'react-redux';

import { searchSelected, searchNavigated } from '../../actions/search.actions';

import { getNavIndex } from '../../helpers';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class SearchListItem extends ImmutableComponent {
    render() {
        const onClick = () => this.props.selectItem();
        const onMouseOver = () => this.props.selected || this.props.highlightItem();

        const className = classNames({ selected: this.props.selected });

        return <li className={className}>
            <div onClick={onClick} onMouseOver={onMouseOver}>
                {this.props.children}
            </div>
        </li>;
    }
}

SearchListItem.propTypes = {
    itemKey: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    selectItem: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    selected: state.getIn(['search', 'navIndex']) === getNavIndex(state)(
        ownProps.itemKey, ownProps.category
    )
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    selectItem: () => dispatch(searchSelected({
        key: ownProps.itemKey, category: ownProps.category
    })),
    highlightItem: () => dispatch(searchNavigated({
        itemKey: ownProps.itemKey, category: ownProps.category
    }))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchListItem);

