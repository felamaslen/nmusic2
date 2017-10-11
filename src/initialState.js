import { fromJS } from 'immutable';

export default fromJS({
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
    player: {
        paused: true,
        url: null,
        seekTime: 0,
        dragTime: null,
        playTime: 0,
        duration: 0
    }
});

