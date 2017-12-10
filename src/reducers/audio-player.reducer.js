import { List as list, Map as map } from 'immutable';
import * as misc from '../constants/misc';
import { changeTrack, nextTrackShuffle } from './audio-track-queue.reducer';

const PLAY_ICON = '\u25b6';
const PAUSE_ICON = '\u23f8';

const titleStatusIcon = playing => {
    if (playing) {
        return PLAY_ICON;
    }

    return PAUSE_ICON;
};

export const resetPlayerTimes = state => state
    .setIn(['player', 'seekTime'], 0)
    .setIn(['player', 'playTime'], 0)
    .setIn(['player', 'dragTime'], null);

const encodeArtistAlbum = (artist, album) => Buffer
    .from([artist, album]
        .map(item => encodeURIComponent(item))
        .join('/')
    )
    .toString('base64');

export const getArtworkSrc = song => `${misc.API_PREFIX}/artwork/${encodeArtistAlbum(
    song.get('artist') || '', song.get('album') || ''
)}`;

export function loadAudioFile(state, song, play = true) {
    let newQueue = state.getIn(['queue', 'songs']);
    const queueActive = state.getIn(['queue', 'active']);
    if (queueActive > -1) {
        const queueActiveId = state.getIn(['queue', 'songs', queueActive, 'id']);

        newQueue = state.getIn(['queue', 'songs'])
            .filterNot(item => item.get('id') === queueActiveId);
    }

    const title = list([
        titleStatusIcon(play),
        song.get('title'),
        `- ${song.get('artist')}`,
        `- ${misc.APP_TITLE}`
    ]);

    const newState = resetPlayerTimes(state)
        .set('title', title)
        .setIn(['player', 'current'], song.get('id'))
        .setIn(['player', 'currentSong'], song)
        .setIn(['cloud', 'localState', 'currentSong'], map({
            artist: song.get('artist'),
            album: song.get('album'),
            title: song.get('title')
        }))
        .setIn(['player', 'url'], `${misc.API_PREFIX}/play/${song.get('id')}`)
        .setIn(['player', 'bufferedRanges'], list.of())
        .setIn(['player', 'bufferedRangesRaw'], null)
        .setIn(['player', 'duration'], song.get('duration'))
        .setIn(['artwork', 'src'], getArtworkSrc(song))
        .setIn(['artwork', 'loaded'], false)
        .setIn(['queue', 'songs'], newQueue)
        .setIn(['queue', 'active'], -1);

    if (play) {
        return newState
            .setIn(['player', 'paused'], false)
            .setIn(['cloud', 'localState', 'paused'], false);
    }

    return newState;
}

export const audioStop = state => resetPlayerTimes(state)
    .set('title', list.of(misc.APP_TITLE))
    .setIn(['cloud', 'localState', 'currentSong'], null)
    .setIn(['cloud', 'localState', 'paused'], true)
    .setIn(['player', 'current'], null)
    .setIn(['player', 'currentSong'], null)
    .setIn(['player', 'url'], null)
    .setIn(['player', 'duration'], 0)
    .setIn(['player', 'paused'], true)
    .setIn(['player', 'audioSource'], null)
    .setIn(['player', 'bufferedRangesRaw'], null)
    .setIn(['player', 'bufferedRanges'], list.of())
    .setIn(['artwork', 'src'], null);

export function handleAudioEnded(state) {
    return changeTrack(state, 1);
}

export function setModeShuffle(state, status) {
    if (typeof status === 'undefined') {
        const modes = [misc.SHUFFLE_ALL, misc.SHUFFLE_NONE];

        const currentModeIndex = modes.indexOf(state.getIn(['player', 'shuffle']));

        const nextMode = modes[(currentModeIndex + 1) % modes.length];

        return state.setIn(['player', 'shuffle'], nextMode);
    }

    return state.setIn(['player', 'shuffle'], status);
}

export const setVolume = (state, { volume }) => state
    .setIn(['player', 'volume'], Math.max(0, Math.min(1, volume)));

export function playFirstSong(state) {
    if (state.getIn(['queue', 'songs']).size > 0) {
        return loadAudioFile(state, state.getIn(['queue', 'songs']).first())
            .setIn(['queue', 'active'], 0);
    }

    if (state.getIn(['songList', 'songs']).size > 0) {
        if (state.getIn(['songList', 'selectedIds']).size > 0) {
            const firstId = state.getIn(['songList', 'selectedIds']).first();

            return loadAudioFile(state, state
                .getIn(['songList', 'songs'])
                .find(song => song.get('id') === firstId)
            );
        }

        if (state.getIn(['player', 'shuffle']) === misc.SHUFFLE_ALL) {
            return nextTrackShuffle(state);
        }

        return loadAudioFile(state, state.getIn(['songList', 'songs']).first());
    }

    return null;
}

export function playPauseAudio(state) {
    const wasPaused = state.getIn(['player', 'paused']);
    const haveSong = Boolean(state.getIn(['player', 'currentSong']));

    if (wasPaused && !haveSong) {
        const nextState = playFirstSong(state);

        if (nextState) {
            return nextState;
        }
    }

    const paused = !(state.getIn(['player', 'currentSong']) && state.getIn(['player', 'paused']));

    return state
        .setIn(['title', 0], titleStatusIcon(!paused))
        .setIn(['player', 'paused'], paused)
        .setIn(['cloud', 'localState', 'paused'], paused);
}

