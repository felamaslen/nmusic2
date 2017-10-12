import {
    API_PREFIX, REPEAT_TRACK, REPEAT_LIST, REWIND_START_TIME
} from '../constants/misc';

const resetPlayerTimes = state => state
    .setIn(['player', 'seekTime'], 0)
    .setIn(['player', 'playTime'], 0)
    .setIn(['player', 'dragTime'], null);

export function loadAudioFile(state, song, play = true) {
    const newState = resetPlayerTimes(state)
        .setIn(['player', 'current'], song.get('id'))
        .setIn(['player', 'url'], `${API_PREFIX}play/${song.get('id')}`)
        .setIn(['player', 'duration'], song.get('duration'));

    if (play) {
        return newState.setIn(['player', 'paused'], false);
    }

    return newState;
}

export const setAudioDuration = (state, duration) => state
    .setIn(['player', 'duration'], duration);

export const audioStop = state => resetPlayerTimes(state)
    .setIn(['player', 'current'], null)
    .setIn(['player', 'url'], null)
    .setIn(['player', 'duration'], 0)
    .setIn(['player', 'paused'], true);

function nextTrack(state, currentId, currentListIndex, songs, queue, queueActive) {
    if (!currentId) {
        const song = queue.size
            ? queue.first()
            : songs.first();

        return loadAudioFile(state, song);
    }

    const repeatCurrentTrack = state.getIn(['player', 'repeat']) === REPEAT_TRACK;
    if (repeatCurrentTrack) {
        return resetPlayerTimes(state);
    }

    const startQueue = queue.size > 0 && queueActive === -1;
    if (startQueue) {
        return loadAudioFile(state, queue.first())
            .setIn(['queue', 'active'], 0);
    }

    const continueQueue = queue.size > queueActive + 1 && queueActive > -1;
    if (continueQueue) {
        return loadAudioFile(state, queue.get(queueActive + 1))
            .setIn(['queue', 'active'], queueActive + 1);
    }

    const songInList = currentListIndex !== -1;
    if (songInList) {
        const nextSongExists = songs.size > currentListIndex + 1;
        if (nextSongExists) {
            return loadAudioFile(state, songs.get(currentListIndex + 1), false);
        }

        if (songs.size > 0) {
            const repeatList = state.getIn(['player', 'repeat']) === REPEAT_LIST;

            if (repeatList) {
                return loadAudioFile(state, songs.first());
            }
        }
    }

    return audioStop(state);
}

function previousTrack(state, currentId, currentListIndex, songs, queue, queueActive) {
    const currentPlayTime = state.getIn(['player', 'playTime']);

    const goToStart = currentPlayTime > REWIND_START_TIME;
    if (goToStart) {
        return resetPlayerTimes(state);
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

