import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';
import ImmutableComponent from '../../ImmutableComponent';

import { VISUALISER_FPS_CAP, VISUALISER_FFT_SIZE } from '../../constants/misc';

import { drawLinearVisualiser } from '../../helpers';

export class AudioVisualisation extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.analyser = this.props.audioContext.createAnalyser();
        this.analyser.fftSize = VISUALISER_FFT_SIZE;

        this.data = new Uint8Array(this.analyser.frequencyBinCount);

        this.animation = null;
        this.animationLastTime = 0;
        const fps = VISUALISER_FPS_CAP;
        this.minTimeBetweenFrames = 1000 / fps;

        this.canvas = null;
        this.ctx = null;

        this.handleResize = () => {
            this.canvas.width = this.canvas.parentNode.offsetWidth;
            this.canvas.height = this.canvas.parentNode.offsetHeight;

            this.draw(this.props.data);
        };

        // only bind the animate function once, because .bind() is expensive enough
        // to create a bottleneck if done on each animation frame
        this.animateBind = this.animate.bind(this);
    }
    createAnalyser() {
        this.props.audioSource.connect(this.analyser);
    }
    draw() {
        drawLinearVisualiser(this.ctx, this.canvas.width, this.canvas.height, this.data);
    }
    animate() {
        this.animation = requestAnimationFrame(this.animateBind);

        const now = Date.now();
        const timeDelta = now - this.animationLastTime;

        if (timeDelta < this.minTimeBetweenFrames) {
            return;
        }

        this.animationLastTime = now;

        this.analyser.getByteFrequencyData(this.data);

        this.draw();
    }
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);

        this.handleResize();
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    componentDidUpdate() {
        if (this.animation) {
            cancelAnimationFrame(this.animation);
        }

        this.createAnalyser();
        this.animate();
    }
    render() {
        const canvasRef = canvas => {
            if (!canvas) {
                return;
            }

            this.ctx = canvas.getContext('2d');
            this.canvas = canvas;
        };

        return <span className="visualiser">
            <canvas ref={canvasRef} className="visualiser-canvas" />
        </span>;
    }
}

let SourceType = Object;
if (typeof MediaElementSourceNode !== 'undefined') {
    SourceType = MediaElementSourceNode; // eslint-disable-line no-undef
}

AudioVisualisation.propTypes = {
    source: PropTypes.instanceOf(SourceType)
};

const mapStateToProps = state => ({
    audioSource: state.get('audioSource'),
    audioContext: state.get('audioContext')
});

export default connect(mapStateToProps)(AudioVisualisation);

