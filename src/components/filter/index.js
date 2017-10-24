import React from 'react';

import FilterList from '../../containers/filter-list';

const FILTERS = ['artist', 'album'];

export default function Filter() {
    return <div className="filter-outer">
        {FILTERS.map(key => <FilterList key={key} filterKey={key} />)}
    </div>;
}

