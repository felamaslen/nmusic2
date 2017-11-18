import { List as list, fromJS } from 'immutable';

import { getNavIndex } from '../helpers';

import { loadAudioFile } from './audio-player.reducer';

const resetSearch = state => state
    .setIn(['search', 'loading'], false)
    .setIn(['search', 'term'], '')
    .setIn(['search', 'artists'], list.of())
    .setIn(['search', 'albums'], list.of())
    .setIn(['search', 'songs'], list.of());

export function changeSearch(state, value) {
    if (value.length) {
        return state
            .setIn(['search', 'loading'], true);
    }

    return resetSearch(state);
}

function selectArtist(state, key) {
    const item = state.getIn(['search', 'artists', key]);

    return state
        .setIn(['search', 'artistSearch'], item)
        .setIn(['search', 'albumSearch'], null)
}

function selectAlbum(state, key) {
    const item = state.getIn(['search', 'albums', key]);

    return state
        .setIn(['search', 'artistSearch'], item.get('artist'))
        .setIn(['search', 'albumSearch'], item.get('album'));
}

function selectSong(state, key) {
    const song = state.getIn(['search', 'songs', key]);

    return loadAudioFile(state, song);
}

export function getSearchKeyCategory(state, navIndex = state.getIn(['search', 'navIndex'])) {
    const listCategories = ['artists', 'albums', 'songs'];

    const result = listCategories.reduce(({ key, category, sumToHere, done }, item) => {
        const items = state.getIn(['search', item]);

        if (done) {
            return { key, category, done: true };
        }

        if (sumToHere + items.size > navIndex) {
            const theKey = navIndex - sumToHere;

            return { key: theKey, category: item, done: true };
        }

        return { key, category: item, sumToHere: sumToHere + items.size, done: false };

    }, {
        key: 0,
        category: null,
        sumToHere: 0,
        done: false
    });

    const { key, category } = result;

    if (!category) {
        throw new Error('value out of range');
    }

    return { key, category };
}

export function selectSearchItem(state, { index, ...req }) {
    if (typeof index !== 'undefined') {
        ({ category: req.category, key: req.key } = getSearchKeyCategory(state, index));
    }

    const { category, key } = req;

    const stateAdvanced = state
        .setIn(['search', 'active'], false)
        .setIn(['songList', 'loading'], true);

    if (category.indexOf('artist') === 0) {
        return selectArtist(stateAdvanced, key);
    }

    if (category.indexOf('album') === 0) {
        return selectAlbum(stateAdvanced, key);
    }

    if (category.indexOf('song') === 0) {
        return selectSong(stateAdvanced, key);
    }

    throw new Error('value for "category" out of range');
}

export function navigateSearch(state, { itemKey, category, key, shift, ctrl }) {
    if (typeof itemKey !== 'undefined' && category) {
        const navIndex = getNavIndex(state)(itemKey, category);

        return state
            .setIn(['search', 'navIndex'], navIndex);
    }

    const goDown = key === 'ArrowUp' ||
        (key === 'ArrowLeft' && ctrl) ||
        (key === 'Tab' && shift);

    const goUp = key === 'ArrowDown' ||
        (key === 'ArrowRight' && ctrl) ||
        (key === 'Tab' && !shift);

    const exit = key === 'Escape';

    if (exit) {
        return state
            .setIn(['search', 'active'], false)
            .setIn(['search', 'navIndex'], -1);
    }

    const delta = (goUp >> 0) - (goDown >> 0);
    const numItems = ['artists', 'albums', 'songs']
        .reduce((sum, item) => sum + state.getIn(['search', item]).size, 0);

    const navIndex = state.getIn(['search', 'navIndex']);

    const newNavIndex = (navIndex + delta + 1 + numItems + 1) % (numItems + 1) - 1;

    return state
        .setIn(['search', 'active'], true)
        .setIn(['search', 'navIndex'], newNavIndex);
}

export function handleSearchResults(state, { response, err, searchTerm }) {
    const data = response && response.data;
    if (!(response && data && data.artists && data.albums && data.titles &&
        Array.isArray(data.artists) && Array.isArray(data.albums) && Array.isArray(data.titles))) {

        return resetSearch(state)
            .setIn(['search', 'active'], false);
    }

    if (err) {
        return state;
    }

    const { artists, albums, titles } = response.data;

    return state
        .setIn(['search', 'term'], searchTerm)
        .setIn(['search', 'active'], true)
        .setIn(['search', 'loading'], false)
        .setIn(['search', 'artists'], fromJS(artists))
        .setIn(['search', 'albums'], fromJS(albums))
        .setIn(['search', 'songs'], fromJS(titles));
}

export function setFocusStatus(state, status) {
    const listLength = ['artists', 'albums', 'songs']
        .reduce((sum, key) => sum + state.getIn(['search', key]).size, 0);

    if (listLength > 0) {
        return state
            .setIn(['search', 'active'], status)
            .setIn(['search', 'navIndex'], -1);
    }

    return state;
}

