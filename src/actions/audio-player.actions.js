import buildAction from '../messageBuilder';
import * as actions from '../constants/actions';

export const audioFileLoaded = file => buildAction(actions.AUDIO_FILE_LOADED, file);

export const audioDurationSet = duration => buildAction(actions.AUDIO_DURATION_SET, duration);

export const audioEnded = () => buildAction(actions.AUDIO_ENDED);

export const audioPlayPaused = () => buildAction(actions.AUDIO_PLAY_PAUSED);

export const audioShuffleSet = status => buildAction(actions.AUDIO_MODE_SHUFFLE_SET, status);

export const audioVolumeSet = (volume, remember) =>
    buildAction(actions.AUDIO_VOLUME_SET, { volume, remember });

export const audioTrackChanged = req => buildAction(actions.AUDIO_TRACK_CHANGED, req);

export const audioSeeked = evt => buildAction(actions.AUDIO_SEEKED, evt);

export const audioTimeUpdated = time => buildAction(actions.AUDIO_TIME_UPDATED, time);

export const audioProgressed = req => buildAction(actions.AUDIO_BUFFERED, req);

export const audioSourceUpdated = audioSource => buildAction(actions.AUDIO_SOURCE_UPDATED, audioSource);

