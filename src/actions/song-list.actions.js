import buildAction, { buildEffectAction } from '../messageBuilder';
import {
    SONG_LIST_REQUESTED, SONG_LIST_RETRIEVED, SONG_LIST_ITEM_CLICKED
} from '../constants/actions';
import { REQUEST_SONG_LIST } from '../constants/effects';

export const songListRequested = () => buildEffectAction(SONG_LIST_REQUESTED)(REQUEST_SONG_LIST);

export const songListRetrieved = res => buildAction(SONG_LIST_RETRIEVED, res);

export const songListItemClicked = id => buildAction(SONG_LIST_ITEM_CLICKED, id);

