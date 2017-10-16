import buildAction, { buildEffectAction } from '../messageBuilder';

import {
    SEARCH_CHANGED, SEARCH_SELECTED, SEARCH_NAVIGATED, SEARCH_RESULTS_RECEIVED
} from '../constants/actions';

import { REQUEST_SEARCH_RESULTS, REQUEST_SEARCHED_SONG_LIST } from '../constants/effects';

export const searchChanged = value => buildEffectAction(SEARCH_CHANGED, value)(REQUEST_SEARCH_RESULTS);

export const searchSelected = index => buildEffectAction(SEARCH_SELECTED, index)(REQUEST_SEARCHED_SONG_LIST);

export const searchNavigated = key => buildAction(SEARCH_NAVIGATED, key);

export const searchResultsReceived = data => buildAction(SEARCH_RESULTS_RECEIVED, data);

