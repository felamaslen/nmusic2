import { connect } from 'react-redux';
import { audioVolumeSet } from '../../actions/audio-player.actions';
import React from 'react';
import PureComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';
import debounce from '../../helpers/debounce';

class VolumeControl extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            active: false,
            clickedAt: null
        };

        this.gutter = null;
        this.head = null;

        this.gutterDim = () => {
            const { left, width } = this.gutter.getBoundingClientRect();

            const { width: headWidth } = this.head.getBoundingClientRect();

            return { left, width, headWidth };
        };

        this.mouseMoveListener = debounce(({ clientX }) => {
            if (this.state.active) {
                this.props.onChange(false, {
                    clientX: clientX - this.state.clickedAt,
                    ...this.gutterDim()
                });
            }
        }, 1);

        this.mouseUpListener = ({ clientX }) => {
            this.props.onChange(true, {
                clientX: clientX - this.state.clickedAt,
                ...this.gutterDim()
            });

            this.setState({
                active: false,
                clickedAt: null
            });
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (!prevState.active && this.state.active) {
            window.addEventListener('mousemove', this.mouseMoveListener);
            window.addEventListener('mouseup', this.mouseUpListener);
        }
        else if (prevState.active && !this.state.active) {
            window.removeEventListener('mousemove', this.mouseMoveListener);
            window.removeEventListener('mouseup', this.mouseUpListener);
        }
    }
    componentWillUnmount() {
        window.removeEventListener('mousemove', this.mouseMoveListener);
        window.removeEventListener('mouseup', this.mouseUpListener);
    }
    render() {
        const innerStyle = {
            flexBasis: `${this.props.volume * 100}%`
        };

        const onDragStart = evt => {
            evt.stopPropagation();

            const { clientX } = evt;

            const clickedAt = clientX - this.head.getBoundingClientRect().left;

            this.setState({ active: true, clickedAt });
        };

        const onVolumeSet = ({ clientX }) => {
            this.props.onChange(true, {
                clientX: clientX - this.head.offsetWidth / 2, ...this.gutterDim()
            });
        };

        const gutterRef = outer => {
            this.gutter = outer;
        };

        const headRef = head => {
            this.head = head;
        };

        return <div className="volume-control-outer">
            <div className="gutter" onMouseDown={onVolumeSet} ref={gutterRef}>
                <div className="inner" style={innerStyle} />
                <div className="head" ref={headRef} onMouseDown={onDragStart} />
            </div>
        </div>;
    }
}

VolumeControl.propTypes = {
    volume: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    volume: state.getIn(['player', 'volume'])
});

const mapDispatchToProps = dispatch => ({
    onChange: (remember, { clientX, left, width, headWidth }) =>
        dispatch(audioVolumeSet((clientX - left) / (width - headWidth), remember))
});

export default connect(mapStateToProps, mapDispatchToProps)(VolumeControl);

