import { createReducer } from 'redux-create-reducer';

import * as AC from '../constants/actions';

import {
    startSongListRequest, insertSongList
} from './song-list.reducer';

import initialState from '../initialState';

function createReducerObject(array) {
    return array.reduce((obj, item) => {
        obj[item[0]] = (state, action) => item[1](state, action.payload);

        return obj;
    }, {});
}

const reducers = createReducerObject([
    [AC.SONG_LIST_REQUESTED, startSongListRequest],
    [AC.SONG_LIST_RETRIEVED, insertSongList]
]);

export default createReducer(initialState, reducers);

