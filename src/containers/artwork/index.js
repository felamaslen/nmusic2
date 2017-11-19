import { connect } from 'react-redux';

import React from 'react';
import PureComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Artwork extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }
    onLoad() {
        this.setState({
            loading: false
        });
    }
    componentDidMount() {
        if (this.props.src) {
            this.setState({
                loading: true
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.src !== this.props.src) {
            this.setState({
                loading: Boolean(this.props.src)
            });
        }
    }
    render() {
        const className = classNames({
            artwork: true,
            loading: this.state.loading
        });

        const onLoad = () => this.onLoad();

        return <div className="artwork-outer">
            <div className={className}>
                <img className="artwork-image" src={this.props.src} onLoad={onLoad} onError={onLoad} />
            </div>
        </div>;
    }
}

Artwork.propTypes = {
    src: PropTypes.string
};

const mapStateToProps = state => ({
    src: state.getIn(['artwork', 'src'])
});

export default connect(mapStateToProps)(Artwork);

