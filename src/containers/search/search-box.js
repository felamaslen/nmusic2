import { connect } from 'react-redux';

import { searchChanged } from '../../actions/search.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

import debounce from '../../helpers/debounce';

import SearchList from './search-list';

export class SearchBox extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.fireChange = debounce(value => this.props.onChange(value), 100, true);

        this.onChange = evt => this.fireChange(evt.target.value);
    }
    render() {
        let searchList = null;
        if (this.props.active) {
            searchList = <SearchList />;
        }

        return <div className="search-box-outer">
            <input className="search-box"
                type="text"
                defaultValue={this.props.value}
                onChange={this.onChange}
            />
            {searchList}
        </div>;
    }
}

SearchBox.propTypes = {
    active: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    active: state.getIn(['search', 'active']),
    value: state.getIn(['search', 'term'])
});

const mapDispatchToProps = dispatch => ({
    onChange: value => dispatch(searchChanged(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);

