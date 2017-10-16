import buildAction from '../messageBuilder';

import {
    FILTER_ITEM_CLICKED, FILTER_LIST_LOADED, FILTER_LIST_RECEIVED
} from '../constants/actions';

export const filterListRequested = key => buildAction(FILTER_LIST_LOADED, { key });

export const filterListReceived = res => buildAction(FILTER_LIST_RECEIVED, res);

export const filterItemClicked = req => buildAction(FILTER_ITEM_CLICKED, req);

