import { List as list } from 'immutable';

import { colorPrimary } from '../constants/styles';

export function handleNaN(value, defaultValue = 0) {
    if (isNaN(value) || typeof value === 'undefined') {
        return defaultValue;
    }

    return value;
}

export function drawLinearVisualiser(ctx, width, height, data) {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(0, height);

    if (data && data.length) {
        const sliceWidth = width / data.length;

        data.forEach((point, key) => {
            const xPix = sliceWidth * key;
            const yPix = height * (1 - point / 256);

            if (key === 0) {
                ctx.moveTo(xPix, yPix);
            }
            else {
                ctx.lineTo(xPix, yPix);
            }
        });
    }

    ctx.lineTo(width, height);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colorPrimary;
    ctx.stroke();
}

export const getJoinedFilter = (filter, selectedKeys) => filter
    .get('items')
    .filter((item, index) => selectedKeys.indexOf(index) !== -1)
    .map(item => encodeURIComponent(item))
    .join(',')


export function getNewlySelectedKeys(currentlySelected, lastClicked, { index, shift, ctrl }) {
    if (index === -1) {
        return list.of();
    }

    if (shift) {
        // select a range
        if (lastClicked === -1) {
            return list([index]);
        }

        if (lastClicked === index) {
            return currentlySelected;
        }

        const minItem = Math.min(index, lastClicked);
        const numItems = 1 + Math.abs(lastClicked - index);

        const newItems = list(new Array(numItems).fill(0))
            .map((item, key) => minItem + key)
            .filter(item => currentlySelected.indexOf(item) === -1);

        return currentlySelected.concat(newItems);
    }

    if (ctrl) {
        const selectedIndex = currentlySelected.indexOf(index);

        if (selectedIndex !== -1) {
            return currentlySelected.delete(selectedIndex);
        }

        return currentlySelected.push(index);
    }

    return list([index]);
}

export const getNavIndex = state => (itemKey, category) => {
    if (category === 'artists') {
        return itemKey;
    }

    if (category === 'albums') {
        return itemKey + state.getIn(['search', 'artists']).size;
    }

    return itemKey + state.getIn(['search', 'artists']).size +
        state.getIn(['search', 'albums']).size;
};

export function getWSUrl(webUrl = 'http://localhost:3000') {
    const url = new URL(webUrl);

    const protocol = url.protocol === 'https:'
        ? 'wss'
        : 'ws';

    return `${protocol}://${url.host}`;
}

export function orderListItems(items, index, delta) {
    const newIndex = Math.max(0, index + delta);

    return items
        .delete(index)
        .splice(newIndex, 0, items.get(index));
}

export const trackNo = track => {
    if (track > 0) {
        return track.toString();
    }

    return '';
}

