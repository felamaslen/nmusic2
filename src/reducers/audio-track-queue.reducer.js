import { List as list } from 'immutable';
import * as misc from '../constants/misc';
import { audioStop, loadAudioFile, resetPlayerTimes } from './audio-player.reducer';

const goToSongStart = state => resetPlayerTimes(state)
    .setIn(['player', 'seekTime'], -1);

function getNextQueue(queue, queueActive) {
    if (queueActive > -1) {
        return queue.delete(queueActive);
    }

    return queue;
}

export function nextTrackShuffle(
    state,
    songs = state.getIn(['songList', 'songs']),
    currentId = state.getIn(['player', 'current'])
) {
    const invalidIds = state
        .getIn(['songList', 'shuffledIds'])
        .push(currentId);

    const allIds = songs.map(song => song.get('id'));

    let validIds = allIds.filterNot(id => invalidIds.includes(id));
    if (!validIds.size) {
        if (state.getIn(['player', 'repeat']) !== misc.REPEAT_LIST) {
            return audioStop(state)
                .setIn(['songList', 'shuffledIds'], list.of());
        }

        validIds = allIds;
    }

    const nextId = validIds.get(Math.floor(Math.random() * validIds.size));
    const nextSong = songs.find(song => song.get('id') === nextId);

    return loadAudioFile(state, nextSong)
        .setIn(['songList', 'shuffledIds'], state
            .getIn(['songList', 'shuffledIds'])
            .push(nextId)
        );
}

function nextTrackFromNone(state, queue, songs) {
    const song = queue.size
        ? queue.first()
        : songs.first();

    return loadAudioFile(state, song);
}

function nextTrackOnQueue(state, queue, queueActive) {
    const queueActiveId = queue.getIn([queueActive, 'id']);
    const newQueue = queue.filterNot(item => item.get('id') === queueActiveId);

    return loadAudioFile(state, newQueue.first())
        .setIn(['queue', 'songs'], newQueue)
        .setIn(['queue', 'active'], 0);
}

function nextTrack(state, currentId, currentListIndex, songs, queue, queueActive) {
    const shuffle = state.getIn(['player', 'shuffle']) === misc.SHUFFLE_ALL;
    if (shuffle && !queue.size) {
        return nextTrackShuffle(state, songs, currentListIndex);
    }

    if (!currentId) {
        return nextTrackFromNone(state, queue, songs);
    }

    const repeatCurrentTrack = state.getIn(['player', 'repeat']) === misc.REPEAT_TRACK;
    if (repeatCurrentTrack) {
        return goToSongStart(state);
    }

    const startQueue = queue.size > 0 && queueActive === -1;
    if (startQueue) {
        return loadAudioFile(state, queue.first())
            .setIn(['queue', 'active'], 0);
    }

    const continueQueue = queueActive > 0 || (queue.size > queueActive + 1 && queueActive > -1);
    if (continueQueue) {
        return nextTrackOnQueue(state, queue, queueActive);
    }

    const nextState = state.setIn(['queue', 'songs'], getNextQueue(queue, queueActive));

    const songInList = currentListIndex !== -1;
    if (songInList) {
        const nextSongExists = songs.size > currentListIndex + 1;
        if (nextSongExists) {
            return loadAudioFile(nextState, songs.get(currentListIndex + 1), false);
        }

        if (songs.size > 0) {
            const repeatList = state.getIn(['player', 'repeat']) === misc.REPEAT_LIST;

            if (repeatList) {
                return loadAudioFile(nextState, songs.first());
            }
        }
    }

    return audioStop(nextState);
}

function previousTrack(state, currentId, currentListIndex, songs, queue, queueActive) {
    const currentPlayTime = state.getIn(['player', 'playTime']);

    const goToStart = currentPlayTime > misc.REWIND_START_TIME;
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

