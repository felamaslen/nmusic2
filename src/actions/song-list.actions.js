import buildAction from '../messageBuilder';
import {
    SONG_LIST_REQUESTED, SONG_LIST_RETRIEVED, SONG_LIST_ITEM_CLICKED,
    SONG_LIST_SORTED, SONG_LIST_QUEUE_ADDED, SONG_LIST_MENU_OPENED
} from '../constants/actions';

export const songListRequested = () => buildAction(SONG_LIST_REQUESTED);

export const songListReceived = res => buildAction(SONG_LIST_RETRIEVED, res);

export const songListItemClicked = id => buildAction(SONG_LIST_ITEM_CLICKED, id);

export const songListSorted = key => buildAction(SONG_LIST_SORTED, key);

export const songListQueueAdded = song => buildAction(SONG_LIST_QUEUE_ADDED, song);

export const songListMenuOpened = req => buildAction(SONG_LIST_MENU_OPENED, req);

