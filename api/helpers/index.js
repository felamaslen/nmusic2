function getSortString(item) {
    return item
        .replace(/^the\s+/i, '')
        .toLowerCase();
}

export function sortCaseInsensitiveIgnorePrefix(prev, next) {
    const prevSortString = getSortString(prev);
    const nextSortString = getSortString(next);

    if (prevSortString < nextSortString) {
        return -1;
    }

    if (prevSortString > nextSortString) {
        return 1;
    }

    return 0;
}

export function getInfoFilterQuery(itemString, key) {
    const filter = itemString
        .split(',')
        .map(item => ({ [`info.${key}`]: decodeURIComponent(item) }));

    return { $or: filter };
}

