export const startSongListRequest = state => ({
    ...state,
    songList: { ...state.songList, loading: true }
});

export function insertSongList(state, { err, response }) {
    let songs = [];

    if (!err) {
        songs = response.data.map(item => ({
            id: item[0],
            title: item[1],
            artist: item[2],
            album: item[3],
            year: item[4],
            duration: item[5]
        }));
    }

    return {
        ...state,
        songList: { loading: false, songs }
    };
}

