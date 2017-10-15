import { fromJS } from 'immutable';

import { REPEAT_NONE } from './constants/misc';

function getAudioContext() {
    if (typeof AudioContext !== 'undefined') {
        return new AudioContext();
    }

    return null;
}

export default fromJS({
    filter: {
        artist: {
            loaded: false,
            items: [],
            selectedKeys: [],
            lastClickedKey: -1
        },
        album: {
            loaded: false,
            items: [],
            selectedKeys: [],
            lastClickedKey: -1
        }
    },
    songList: {
        songs: [],
        loading: false,
        selectedIds: [],
        lastClickedId: -1,
        orderKeys: [
            { key: 'title', order: 1 },
            { key: 'track', order: 1 },
            { key: 'album', order: 1 },
            { key: 'artist', order: 1 }
        ]
    },
    audioSource: null,
    audioContext: getAudioContext(),
    queue: {
        songs: [],
        active: -1
    },
    artwork: {
        src: null,
        loaded: true
    },
    player: {
        current: null,
        currentSong: null,
        paused: true,
        url: null,
        seekTime: 0,
        dragTime: null,
        playTime: 0,
        duration: 0,
        bufferedRangesRaw: null,
        bufferedRanges: [],
        repeat: REPEAT_NONE
    }
});

