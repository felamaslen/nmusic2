import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import { songListItemClicked } from '../../actions/song-list.actions';
import { audioFileLoaded } from '../../actions/audio-player.actions';

import React from 'react';
import PropTypes from 'prop-types';
import ImmutableComponent from '../../ImmutableComponent';
import classNames from 'classnames';

export class SongListItem extends ImmutableComponent {
    render() {
        const className = classNames({ song: true, selected: this.props.selected });

        const onMouseDown = evt => this.props.selectSong({
            index: this.props.listKey,
            ctrl: evt.ctrlKey,
            shift: evt.shiftKey
        });

        return <span key={this.props.song.get('id')} className={className}
            onMouseDown={onMouseDown}
            onDoubleClick={() => this.props.playSong(this.props.song)}>

            <span className="track">{this.props.song.get('trackNo')}</span>
            <span className="title">{this.props.song.get('title')}</span>
            <span className="duration">{this.props.song.get('durationFormatted')}</span>
            <span className="artist">{this.props.song.get('artist')}</span>
            <span className="album">{this.props.song.get('album')}</span>
        </span>;
    }
}

SongListItem.propTypes = {
    song: PropTypes.instanceOf(map).isRequired,
    selected: PropTypes.bool.isRequired,
    selectSong: PropTypes.func.isRequired,
    playSong: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    song: state.getIn(['global', 'songList', 'songs', ownProps.listKey]),
    selected: state
        .getIn(['global', 'songList', 'selectedIds'])
        .indexOf(ownProps.id) !== -1
});

const mapDispatchToProps = dispatch => ({
    selectSong: req => dispatch(songListItemClicked(req)),
    playSong: song => dispatch(audioFileLoaded(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongListItem);

