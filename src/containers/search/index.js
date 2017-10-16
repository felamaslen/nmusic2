import { connect } from 'react-redux';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

import SearchBox from './search-box';
import SearchList from './search-list';

export class Search extends ImmutableComponent {
    render() {
        let searchList = null;
        if (this.props.active) {
            searchList = <SearchList />;
        }

        return <div className="search-outer">
            <SearchBox />
            {searchList}
        </div>;
    }
}

Search.propTypes = {
    active: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    active: state.getIn(['search', 'active'])
});

export default connect(mapStateToProps)(Search);

