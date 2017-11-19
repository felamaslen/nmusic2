import buildAction from '../messageBuilder';

import {
    SEARCH_CHANGED, SEARCH_SELECTED, SEARCH_NAVIGATED, SEARCH_RESULTS_RECEIVED,
    SEARCH_FOCUS_SET, SEARCH_BOX_FOCUSED
} from '../constants/actions';

export const searchChanged = value => buildAction(SEARCH_CHANGED, value);

export const searchSelected = req => buildAction(SEARCH_SELECTED, req);

export const searchNavigated = key => buildAction(SEARCH_NAVIGATED, key);

export const searchResultsReceived = data => buildAction(SEARCH_RESULTS_RECEIVED, data);

export const searchFocusSet = status => buildAction(SEARCH_FOCUS_SET, status);

export const searchBoxFocused = () => buildAction(SEARCH_BOX_FOCUSED);

