import buildAction, { buildEffectAction } from '../messageBuilder';

import {
    SEARCH_CHANGED, SEARCH_SELECTED, SEARCH_NAVIGATED, SEARCH_RESULTS_RECEIVED, SEARCH_FOCUS_SET
} from '../constants/actions';

import { REQUEST_SEARCH_RESULTS, REQUEST_SEARCHED_SONG_LIST } from '../constants/effects';

export const searchChanged = value => buildEffectAction(SEARCH_CHANGED, value)(REQUEST_SEARCH_RESULTS);

export const searchSelected = index => buildEffectAction(SEARCH_SELECTED, index)(REQUEST_SEARCHED_SONG_LIST);

export const searchNavigated = key => buildEffectAction(SEARCH_NAVIGATED, key)(REQUEST_SEARCHED_SONG_LIST);

export const searchResultsReceived = data => buildAction(SEARCH_RESULTS_RECEIVED, data);

export const searchFocusSet = status => buildAction(SEARCH_FOCUS_SET, status);

