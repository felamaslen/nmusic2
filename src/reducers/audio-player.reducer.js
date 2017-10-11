import {
    API_PREFIX, REPEAT_TRACK, REPEAT_LIST
} from '../constants/misc';

const resetPlayerTimes = state => state
    .setIn(['player', 'seekTime'], 0)
    .setIn(['player', 'playTime'], 0)
    .setIn(['player', 'dragTime'], null);

export const loadAudioFile = (state, song) => resetPlayerTimes(state)
    .setIn(['player', 'current'], song.get('id'))
    .setIn(['player', 'url'], `${API_PREFIX}play/${song.get('id')}`)
    .setIn(['player', 'duration'], song.get('duration'))
    .setIn(['player', 'paused'], false);

export const setAudioDuration = (state, duration) => state
    .setIn(['player', 'duration'], duration);

export const audioStop = state => resetPlayerTimes(state)
    .setIn(['player', 'current'], null)
    .setIn(['player', 'url'], null)
    .setIn(['player', 'duration'], 0)
    .setIn(['player', 'paused'], true);

export function handleAudioEnded(state) {
    const queue = state.get('queue');

    if (queue.size) {
        return loadAudioFile(state, queue.first())
            .set('queue', queue.shift());
    }

    const currentSongId = state.getIn(['player', 'current']);
    const songs = state.getIn(['songList', 'songs']);

    const listIndex = songs.findIndex(song => song.get('id') === currentSongId);
    if (listIndex === -1) {
        return audioStop(state);
    }

    const nextSongExists = songs.size > listIndex + 1;
    if (nextSongExists) {
        return loadAudioFile(state, songs.get(listIndex + 1));
    }

    if (songs.size > 0) {
        const repeatMode = state.getIn(['songList', 'repeat']);

        if (repeatMode === REPEAT_LIST) {
            return loadAudioFile(state, songs.first());
        }

        if (repeatMode === REPEAT_TRACK) {
            return resetPlayerTimes(state)
                .setIn(['player', 'paused'], false);
        }
    }

    return audioStop(state);
}

export const playPauseAudio = state => state
    .setIn(['player', 'paused'], !state.getIn(['player', 'paused']));

function getClickedPlayTime(state, { clientX, target }) {
    const trough = target.parentNode.parentNode;

    const progress = (clientX - trough.offsetLeft) / trough.offsetWidth;

    if (isNaN(progress)) {
        return state.getIn(['player', 'seekTime']);
    }

    const duration = state.getIn(['player', 'duration']);

    return duration * progress;
}

export function audioSeek(state, { dragging, ...evt }) {
    const newTime = getClickedPlayTime(state, evt);

    if (dragging) {
        return state.setIn(['player', 'dragTime'], newTime);
    }

    return state
        .setIn(['player', 'dragTime'], null)
        .setIn(['player', 'seekTime'], newTime)
        .setIn(['player', 'playTime'], newTime);
}

export const audioTimeUpdate = (state, time) => state
    .setIn(['player', 'playTime'], time);

export const updateAudioAnalyser = (state, frequencyData) => state
    .set('frequencyData', frequencyData);

