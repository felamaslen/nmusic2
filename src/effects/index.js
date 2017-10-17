import * as EF from '../constants/effects';

import { requestSongList } from './song-list.effects';
import { requestFilterList } from './filter.effects';
import { requestSearchResults, requestSearchedSongList } from './search.effects';

function createEffectHandler(effects) {
    return effects.reduce((obj, item) => {
        obj[item[0]] = (dispatch, reduction, payload) => item[1](dispatch, reduction, payload);

        return obj;
    }, {});
}

export default createEffectHandler([
    [EF.REQUEST_SONG_LIST, requestSongList],
    [EF.REQUEST_FILTER_LIST, requestFilterList],
    [EF.REQUEST_SEARCH_RESULTS, requestSearchResults],
    [EF.REQUEST_SEARCHED_SONG_LIST, requestSearchedSongList]
]);

