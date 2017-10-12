import { API_PREFIX } from '../constants/misc';

export const loadAudioFile = (state, song) => state
    .setIn(['player', 'current'], song.get('id'))
    .setIn(['player', 'url'], `${API_PREFIX}play/${song.get('id')}`)
    .setIn(['player', 'seekTime'], 0)
    .setIn(['player', 'playTime'], 0)
    .setIn(['player', 'dragTime'], null)
    .setIn(['player', 'duration'], song.get('duration'))
    .setIn(['player', 'paused'], false);

export const setAudioDuration = (state, duration) => state
    .setIn(['player', 'duration'], duration);

// TODO: skip to the next track or whatever
export const handleAudioEnded = state => state;

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

export const updateAudioNode = (state, audioNode) => state
    .set('audioNode', audioNode);

