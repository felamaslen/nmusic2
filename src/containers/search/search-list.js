import { List as list } from 'immutable';
import { connect } from 'react-redux';

import { searchNavigated, searchSelected } from '../../actions/search.actions';

import React from 'react';
import ImmutableComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class SearchList extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.keyListener = evt => {
            const { key, shiftKey } = evt;

            this.props.navigate(key, shiftKey);

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
    getNavIndex(key, category) {
        if (category === 'artists') {
            return key;
        }

        if (category === 'albums') {
            return key + this.props.artists.size;
        }

        return key + this.props.artists.size + this.props.albums.size;
    }
    renderArtists() {
        return this.props.artists.map((artist, key) => {
            const className = classNames({
                selected: this.props.navIndex === this.getNavIndex(key, 'artists')
            });

            const onClick = () => this.props.selectItem(key, 'artist');

            return <li key={artist} onClick={onClick} className={className}>
                <span className="artist">{artist}</span>
            </li>;
        });
    }
    renderAlbums() {
        return this.props.albums.map((item, key) => {
            const className = classNames({
                selected: this.props.navIndex === this.getNavIndex(key, 'albums')
            });

            const onClick = () => this.props.selectItem(key, 'album');

            const liKey = item.join(',');

            return <li key={liKey} onClick={onClick} className={className}>
                <span className="album">{item.get('album')}</span>
                <span className="artist">{item.get('artist')}</span>
            </li>;
        });
    }
    renderSongs() {
        return this.props.songs.map((song, key) => {
            const className = classNames({
                selected: this.props.navIndex === this.getNavIndex(key, 'songs')
            });

            const onClick = () => this.props.selectItem(key, 'song');

            return <li key={song.get('id')} onClick={onClick} className={className}>
                <span className="title">{song.get('title')}</span>
                <span className="artist">{song.get('artist')}</span>
            </li>;
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
    songs: PropTypes.instanceOf(list).isRequired,
    selectItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    loading: state.getIn(['search', 'loading']),
    navIndex: state.getIn(['search', 'navIndex']),
    artists: state.getIn(['search', 'artists']),
    albums: state.getIn(['search', 'albums']),
    songs: state.getIn(['search', 'songs'])
});

const mapDispatchToProps = dispatch => ({
    selectItem: (key, category) => dispatch(searchSelected({ key, category })),
    navigate: (key, shift) => dispatch(searchNavigated({ key, shift }))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchList);

