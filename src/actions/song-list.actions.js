import buildAction, { buildEffectAction } from '../actionBuilder';
import {
    SONG_LIST_REQUESTED, SONG_LIST_RETRIEVED
} from '../constants/actions';
import { REQUEST_SONG_LIST } from '../constants/effects';

export const songListRequested = () => buildEffectAction(SONG_LIST_REQUESTED)(REQUEST_SONG_LIST);

export const songListRetrieved = res => buildAction(SONG_LIST_RETRIEVED, res);

