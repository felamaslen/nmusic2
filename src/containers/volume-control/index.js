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
            clickedAt: null,
            startOffset: null
        };

        this.outer = null;
        this.head = null;

        const onChange = (clientX, remember = false) => this.props.onChange(
            remember,
            clientX - this.state.startOffset,
            this.outer.offsetLeft,
            this.outer.offsetWidth
        );

        this.mouseMoveListener = debounce(({ clientX }) => {
            if (this.state.active) {
                onChange(clientX);
            }
        }, 1);

        this.mouseUpListener = ({ clientX }) => {
            onChange(clientX, true);

            this.setState({
                active: false,
                clickedAt: null,
                startOffset: null
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

            const clickedAt = clientX;
            const startOffset = clientX - this.outer.offsetLeft - this.head.offsetLeft;

            this.setState({ active: true, clickedAt, startOffset });
        };

        const onVolumeSet = ({ clientX }) => {
            this.props.onChange(
                true,
                clientX - this.head.offsetWidth / 2,
                this.outer.getBoundingClientRect().left,
                this.outer.offsetWidth
            );
        }

        const outerRef = outer => {
            this.outer = outer;
        };

        const headRef = head => {
            this.head = head;
        };

        return <div className="volume-control-outer" ref={outerRef}>
            <div className="gutter" onMouseDown={onVolumeSet}>
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
    onChange: (remember, position, offset, width) =>
        dispatch(audioVolumeSet((position - offset) / width, remember))
});

export default connect(mapStateToProps, mapDispatchToProps)(VolumeControl);

