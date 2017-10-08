import * as EF from '../constants/effects';

import { requestSongList } from './song-list.effects';

function createEffectHandler(effects) {
    return effects.reduce((obj, item) => {
        obj[item[0]] = (dispatch, reduction, payload) => item[1](dispatch, reduction, payload);

        return obj;
    }, {});
}

export default createEffectHandler([
    [EF.REQUEST_SONG_LIST, requestSongList]
]);

