import { List as list } from 'immutable';
import { connect } from 'react-redux';

import { searchNavigated } from '../../actions/search.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SearchListItem from './search-list-item';

export class SearchList extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.keyListener = evt => {
            const { key, shiftKey, ctrlKey } = evt;

            this.props.navigate(key, shiftKey, ctrlKey);

            if (key === 'Tab') {
                evt.preventDefault();
            }
        };
    }
    componentDidMount() {
        window.addEventListener('keydown', this.keyListener);
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyListener);
    }
    renderArtists() {
        return this.props.artists.map((artist, key) => {
            return <SearchListItem key={artist} itemKey={key} category="artists">
                <span className="artist">{artist}</span>
            </SearchListItem>;
        });
    }
    renderAlbums() {
        return this.props.albums.map((item, key) => {
            return <SearchListItem key={item.join(',')} itemKey={key} category="albums">
                <span className="album">{item.get('album')}</span>
                <span className="artist">{item.get('artist')}</span>
            </SearchListItem>;
        });
    }
    renderSongs() {
        return this.props.songs.map((song, key) => {
            return <SearchListItem key={song.get('id')} itemKey={key} category="songs">
                <span className="title">{song.get('title')}</span>
                <span className="artist">{song.get('artist')}</span>
            </SearchListItem>;
        });
    }
    render() {
        const classNameOuter = classNames({
            'search-list-outer': true,
            loading: this.props.loading
        });

        return <div className={classNameOuter}>
            <div className="search-list search-list-artists">
                <ul className="search-list-artists-inner">
                    {this.renderArtists()}
                </ul>
            </div>
            <div className="search-list search-list-albums">
                <ul className="search-list-albums-inner">
                    {this.renderAlbums()}
                </ul>
            </div>
            <div className="search-list search-list-songs">
                <ul className="search-list-songs-inner">
                    {this.renderSongs()}
                </ul>
            </div>
        </div>;
    }
}

SearchList.propTypes = {
    loading: PropTypes.bool.isRequired,
    navIndex: PropTypes.number.isRequired,
    artists: PropTypes.instanceOf(list).isRequired,
    albums: PropTypes.instanceOf(list).isRequired,
    songs: PropTypes.instanceOf(list).isRequired
};

const mapStateToProps = state => ({
    loading: state.getIn(['search', 'loading']),
    navIndex: state.getIn(['search', 'navIndex']),
    artists: state.getIn(['search', 'artists']),
    albums: state.getIn(['search', 'albums']),
    songs: state.getIn(['search', 'songs'])
});

const mapDispatchToProps = dispatch => ({
    navigate: (key, shift, ctrl) => dispatch(searchNavigated({ key, shift, ctrl }))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchList);

