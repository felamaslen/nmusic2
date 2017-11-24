import buildAction from '../messageBuilder';
import {
    AUDIO_FILE_LOADED,
    AUDIO_DURATION_SET,
    AUDIO_ENDED,
    AUDIO_PLAY_PAUSED,
    AUDIO_MODE_SHUFFLE_SET,
    AUDIO_TRACK_CHANGED,
    AUDIO_SEEKED,
    AUDIO_TIME_UPDATED,
    AUDIO_BUFFERED,
    AUDIO_SOURCE_UPDATED
} from '../constants/actions';

export const audioFileLoaded = file => buildAction(AUDIO_FILE_LOADED, file);

export const audioDurationSet = duration => buildAction(AUDIO_DURATION_SET, duration);

export const audioEnded = () => buildAction(AUDIO_ENDED);

export const audioPlayPaused = () => buildAction(AUDIO_PLAY_PAUSED);

export const audioShuffleSet = status => buildAction(AUDIO_MODE_SHUFFLE_SET, status);

export const audioTrackChanged = req => buildAction(AUDIO_TRACK_CHANGED, req);

export const audioSeeked = evt => buildAction(AUDIO_SEEKED, evt);

export const audioTimeUpdated = time => buildAction(AUDIO_TIME_UPDATED, time);

export const audioProgressed = req => buildAction(AUDIO_BUFFERED, req);

export const audioSourceUpdated = audioSource => buildAction(AUDIO_SOURCE_UPDATED, audioSource);

