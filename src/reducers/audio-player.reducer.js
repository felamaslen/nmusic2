import { API_PREFIX } from '../constants/misc';

export const loadAudioFile = (state, song) => state
    .setIn(['player', 'url'], `${API_PREFIX}play/${song.get('id')}`)
    .setIn(['player', 'seekTime'], 0)
    .setIn(['player', 'playTime'], 0)
    .setIn(['player', 'duration'], 0)
    .setIn(['player', 'paused'], false);

export const setAudioDuration = (state, duration) => state
    .setIn(['player', 'duration'], duration);

// TODO: skip to the next track or whatever
export const handleAudioEnded = state => state;

export const playPauseAudio = state => state
    .setIn(['player', 'paused'], !state.getIn(['player', 'paused']));

export const audioSeek = (state, time) => state
    .setIn(['player', 'seekTime'], time);

export const audioTimeUpdate = (state, time) => state
    .setIn(['player', 'playTime'], time);

