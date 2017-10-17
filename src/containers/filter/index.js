import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';

import FilterList from './filter-list';

export default class Filter extends ImmutableComponent {
    render() {
        const filters = ['artist', 'album'].map(key => <FilterList key={key} filterKey={key} />);

        return <div className="filter-outer">
            {filters}
        </div>;
    }
}

