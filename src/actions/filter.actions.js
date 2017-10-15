import buildAction, { buildEffectAction } from '../messageBuilder';

import { FILTER_ITEM_CLICKED, FILTER_LIST_LOADED } from '../constants/actions';
import { REQUEST_SONG_LIST, REQUEST_FILTER_LIST } from '../constants/effects';

export const filterListRequested = key => buildEffectAction(FILTER_LIST_LOADED, { key })(REQUEST_FILTER_LIST);

export const filterListReceived = res => buildAction(FILTER_LIST_LOADED, res);

export const filterItemClicked = req => buildEffectAction(FILTER_ITEM_CLICKED, req)(REQUEST_SONG_LIST);

