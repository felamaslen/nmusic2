import { List as list, Map as map } from 'immutable';

import {
    API_PREFIX, REPEAT_TRACK, REPEAT_LIST, REWIND_START_TIME
} from '../constants/misc';

const resetPlayerTimes = state => state
    .setIn(['player', 'seekTime'], 0)
    .setIn(['player', 'playTime'], 0)
    .setIn(['player', 'dragTime'], null);

const encodeArtistAlbum = (artist, album) => Buffer
    .from([artist, album]
        .map(item => encodeURIComponent(item))
        .join('/'))
    .toString('base64');

const getArtworkSrc = song => `${API_PREFIX}/artwork/${encodeArtistAlbum(
    song.get('artist') || '', song.get('album')
)}`;

export function loadAudioFile(state, song, play = true) {
    const queueActive = state.getIn(['queue', 'active']);
    let queue = state.getIn(['queue', 'songs']);
    if (queueActive > -1) {
        queue = queue.shift();
    }

    const newState = resetPlayerTimes(state)
        .setIn(['player', 'current'], song.get('id'))
        .setIn(['player', 'currentSong'], song)
        .setIn(['cloud', 'localState', 'currentSong'], map({
            artist: song.get('artist'),
            album: song.get('album'),
            title: song.get('title')
        }))
        .setIn(['player', 'url'], `${API_PREFIX}/play/${song.get('id')}`)
        .setIn(['player', 'bufferedRanges'], list.of())
        .setIn(['player', 'bufferedRangesRaw'], null)
        .setIn(['player', 'duration'], song.get('duration'))
        .setIn(['artwork', 'src'], getArtworkSrc(song))
        .setIn(['artwork', 'loaded'], false)
        .setIn(['queue', 'songs'], queue)
        .setIn(['queue', 'active'], -1);

    if (play) {
        return newState
            .setIn(['player', 'paused'], false)
            .setIn(['cloud', 'localState', 'paused'], false);
    }

    return newState;
}

export const audioStop = state => resetPlayerTimes(state)
    .setIn(['cloud', 'localState', 'currentSong'], null)
    .setIn(['player', 'current'], null)
    .setIn(['player', 'currentSong'], null)
    .setIn(['player', 'url'], null)
    .setIn(['player', 'duration'], 0)
    .setIn(['player', 'paused'], true)
    .setIn(['player', 'audioSource'], null)
    .setIn(['player', 'bufferedRangesRaw'], null)
    .setIn(['player', 'bufferedRanges'], list.of());

const goToSongStart = state => resetPlayerTimes(state)
    .setIn(['player', 'seekTime'], -1);

function getNextQueue(queue, queueActive) {
    if (queueActive > -1) {
        return queue.delete(queueActive);
    }

    return queue;
}

function nextTrack(state, currentId, currentListIndex, songs, queue, queueActive) {
    if (!currentId) {
        const song = queue.size
            ? queue.first()
            : songs.first();

        return loadAudioFile(state, song);
    }

    const repeatCurrentTrack = state.getIn(['player', 'repeat']) === REPEAT_TRACK;
    if (repeatCurrentTrack) {
        return goToSongStart(state);
    }

    const startQueue = queue.size > 0 && queueActive === -1;
    if (startQueue) {
        return loadAudioFile(state, queue.first())
            .setIn(['queue', 'active'], 0);
    }

    const continueQueue = queue.size > queueActive + 1 && queueActive > -1;
    if (continueQueue) {
        return loadAudioFile(state, queue.get(queueActive + 1))
            .setIn(['queue', 'songs'], queue.shift())
            .setIn(['queue', 'active'], 0);
    }

    const nextState = state.setIn(['queue', 'songs'], getNextQueue(queue, queueActive));

    const songInList = currentListIndex !== -1;
    if (songInList) {
        const nextSongExists = songs.size > currentListIndex + 1;
        if (nextSongExists) {
            return loadAudioFile(nextState, songs.get(currentListIndex + 1), false);
        }

        if (songs.size > 0) {
            const repeatList = state.getIn(['player', 'repeat']) === REPEAT_LIST;

            if (repeatList) {
                return loadAudioFile(nextState, songs.first());
            }
        }
    }

    return audioStop(nextState);
}

function previousTrack(state, currentId, currentListIndex, songs, queue, queueActive) {
    const currentPlayTime = state.getIn(['player', 'playTime']);

    const goToStart = currentPlayTime > REWIND_START_TIME;
    if (goToStart) {
        return goToSongStart(state);
    }

    const queueItemExists = queueActive > 0;
    if (queueItemExists) {
        return loadAudioFile(state, queue.get(queueActive - 1))
            .setIn(['queue', 'active'], queueActive - 1);
    }

    const playLastListItem = songs.size > 0 && queueActive === 0;
    if (playLastListItem) {
        return loadAudioFile(state, songs.last())
            .setIn(['queue', 'active'], -1);
    }

    const listItemExists = currentListIndex > 0;
    if (listItemExists) {
        return loadAudioFile(state, songs.get(currentListIndex - 1))
            .setIn(['player', 'paused'], state.getIn(['player', 'paused']));
    }

    return audioStop(state);
}

export function changeTrack(state, direction) {
    const songs = state.getIn(['songList', 'songs']);
    const queue = state.getIn(['queue', 'songs']);
    const queueActive = state.getIn(['queue', 'active']);

    if (!songs.size && !queue.size) {
        return audioStop(state);
    }

    const currentId = state.getIn(['player', 'current']);
    const currentListIndex = songs.findIndex(song => song.get('id') === currentId);

    if (direction > 0) {
        return nextTrack(state, currentId, currentListIndex, songs, queue, queueActive);
    }

    if (direction < 0) {
        return previousTrack(state, currentId, currentListIndex, songs, queue, queueActive);
    }

    return state;
}

export function handleAudioEnded(state) {
    return changeTrack(state, 1);
}

export function playPauseAudio(state) {
    const paused = !(state.getIn(['player', 'currentSong']) && state.getIn(['player', 'paused']));

    return state
        .setIn(['player', 'paused'], paused)
        .setIn(['cloud', 'localState', 'paused'], paused);
}

function rootOffsetLeft(elem) {
    if (elem.offsetParent) {
        return elem.offsetLeft + rootOffsetLeft(elem.offsetParent);
    }

    return elem.offsetLeft;
}

function getClickedPlayTime(state, { clientX, target }) {
    const trough = target.parentNode.parentNode;

    const progress = (clientX - rootOffsetLeft(trough)) / trough.offsetWidth;

    if (isNaN(progress)) {
        return state.getIn(['player', 'seekTime']);
    }

    const duration = state.getIn(['player', 'duration']);

    return duration * progress;
}

const audioSeekRaw = (state, newTime) => state
    .setIn(['player', 'dragTime'], null)
    .setIn(['player', 'seekTime'], newTime)
    .setIn(['player', 'playTime'], newTime);

export function audioSeek(state, { raw, dragging, ...evt }) {
    if (raw) {
        return audioSeekRaw(state, evt.newTime);
    }

    const newTime = getClickedPlayTime(state, evt);

    if (dragging) {
        return state.setIn(['player', 'dragTime'], newTime);
    }

    return audioSeekRaw(state, newTime);
}

function getBufferedRangesAsProps(buffered, duration) {
    if (!(duration && buffered && buffered.length)) {
        return list.of();
    }

    return list(new Array(buffered.length).fill(0))
        .map((item, key) => ({
            left: `${buffered.start(key) / duration * 100}%`,
            width: `${(buffered.end(key) - buffered.start(key)) / duration * 100}%`
        }));
}

export const setAudioDuration = (state, duration) => state
    .setIn(['player', 'buffered'], getBufferedRangesAsProps(
        state.getIn(['player', 'bufferedRangesRaw']), duration
    ))
    .setIn(['player', 'duration'], duration);

export const audioProgressBuffer = (state, { buffered, duration }) => state
    .setIn(['player', 'bufferdRangesRaw'], buffered)
    .setIn(['player', 'bufferedRanges'], getBufferedRangesAsProps(buffered, duration));

export const audioTimeUpdate = (state, time) => state
    .setIn(['player', 'playTime'], time);

export const updateAudioSource = (state, audioSource) => state
    .set('audioSource', audioSource);

