import { List as list, Map as map } from 'immutable';
import { connect } from 'react-redux';

import { songListSorted } from '../../actions/song-list.actions';

import React from 'react';
import PropTypes from 'prop-types';
import ImmutableComponent from '../../ImmutableComponent';
import classNames from 'classnames';

export class SongListHead extends ImmutableComponent {
    renderItem(title, key, sortable) {
        if (sortable) {
            const className = classNames({
                [key]: true,
                'sort-asc': this.props.sortOrder.get(key) === 1,
                'sort-desc': this.props.sortOrder.get(key) === -1,
                selected: this.props.justSelected.size &&
                    this.props.justSelected.get(0) === key
            });

            const onClick = () => this.props.sortList(key);

            return <span className={className} onClick={onClick}>{title}</span>;
        }

        return <span className={key}>{title}</span>;
    }
    render() {
        const itemTitle = this.renderItem('Title', 'title', true);
        const itemDuration = this.renderItem('Duration', 'duration', false);
        const itemArtist = this.renderItem('Artist', 'artist', true);
        const itemAlbum = this.renderItem('Album', 'album', true);

        return <span className="song-list-head">
            {itemTitle}
            {itemDuration}
            {itemArtist}
            {itemAlbum}
        </span>
    }
}

SongListHead.propTypes = {
    sortOrder: PropTypes.instanceOf(map).isRequired,
    justSelected: PropTypes.instanceOf(list).isRequired,
    sortList: PropTypes.func.isRequired
};

const keySort = state => key => state.getIn(['global', 'songList', 'orderKeys'])
    .filter(item => item.get('key') === key)
    .getIn([0, 'order']);

const mapStateToProps = state => ({
    sortOrder: map({
        title: keySort(state)('title'),
        artist: keySort(state)('artist'),
        album: keySort(state)('album')
    }),
    justSelected: state
        .getIn(['global', 'songList', 'orderKeys'])
        .slice(-1)
        .map(item => item.get('key'))
});

const mapDispatchToProps = dispatch => ({
    sortList: key => dispatch(songListSorted(key))
});

export default connect(mapStateToProps, mapDispatchToProps)(SongListHead);

