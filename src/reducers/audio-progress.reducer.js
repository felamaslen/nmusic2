import { List as list } from 'immutable';

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
    .setIn(['player', 'audioSource'], audioSource);

