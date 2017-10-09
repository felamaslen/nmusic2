import { fromJS } from 'immutable';

export default fromJS({
    songList: {
        songs: [],
        loading: false
    },
    player: {
        paused: true,
        url: null,
        seekTime: 0,
        playTime: 0,
        duration: 0
    }
});

