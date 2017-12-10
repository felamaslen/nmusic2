export const PERSISTENT_SETTINGS = [
    ['sidebar', 'hidden'],
    ['sidebar', 'displayOver'],
    ['player', 'volume']
];

export const keyFromStore = storeKey => storeKey.join('_');

export const keyFromSettings = key => key.split('_');

