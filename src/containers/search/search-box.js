import { connect } from 'react-redux';

import { searchChanged } from '../../actions/search.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

import debounce from '../../helpers/debounce';

export class SearchBox extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.fireChange = debounce(value => this.props.onChange(value), 100, true);

        this.onChange = evt => this.fireChange(evt.target.value);
    }
    render() {
        return <div className="search-box-outer">
            <input className="search-box"
                type="text"
                defaultValue={this.props.value}
                onChange={this.onChange}
            />
        </div>;
    }
}

SearchBox.propTypes = {
    value: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    value: state.getIn(['search', 'term'])
});

const mapDispatchToProps = dispatch => ({
    onChange: value => dispatch(searchChanged(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);

