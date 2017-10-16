import buildAction from '../messageBuilder';

import {
    SEARCH_CHANGED, SEARCH_SELECTED, SEARCH_NAVIGATED, SEARCH_RESULTS_RECEIVED
} from '../constants/actions';

export const searchChanged = value => buildAction(SEARCH_CHANGED, value);

export const searchSelected = index => buildAction(SEARCH_SELECTED, index);

export const searchNavigated = key => buildAction(SEARCH_NAVIGATED, key);

export const searchResultsReceived = data => buildAction(SEARCH_RESULTS_RECEIVED, data);

