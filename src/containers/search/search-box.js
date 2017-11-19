import { connect } from 'react-redux';

import { searchChanged, searchFocusSet } from '../../actions/search.actions';

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

        this.onTabTo = evt => {
            if (evt.key === 'Tab' && !this.props.active) {
                this.props.setFocus();
                this.input.focus();

                evt.preventDefault();
                evt.stopPropagation();
            }
        };

        this.input = null;
    }
    componentDidMount() {
        window.addEventListener('keydown', this.onTabTo);
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.onTabTo);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.focus !== this.props.focus && this.input) {
            this.input.focus();
        }
    }
    render() {
        let searchList = null;
        if (this.props.active) {
            searchList = <SearchList />;
        }

        const onFocus = () => this.props.setFocus(true);
        const inputRef = input => {
            this.input = input;
        };

        return <div className="search-box-outer">
            <input className="search-box" ref={inputRef}
                type="text"
                defaultValue={this.props.value}
                onChange={this.onChange}
                onFocus={onFocus}
            />
            {searchList}
        </div>;
    }
}

SearchBox.propTypes = {
    active: PropTypes.bool.isRequired,
    focus: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    setFocus: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    active: state.getIn(['search', 'active']),
    focus: state.getIn(['search', 'focus']),
    value: state.getIn(['search', 'term'])
});

const mapDispatchToProps = dispatch => ({
    onChange: value => dispatch(searchChanged(value)),
    setFocus: (status = true) => dispatch(searchFocusSet(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);

