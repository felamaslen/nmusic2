import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';
import ImmutableComponent from '../../ImmutableComponent';

import { drawLinearVisualiser } from '../../helpers';

import './style.scss';

export class AudioVisualisation extends ImmutableComponent {
    constructor(props) {
        super(props);

        this.source = null;
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 512;

        this.data = new Uint8Array(this.analyser.frequencyBinCount);

        this.animation = null;

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
        this.source = this.audioCtx.createMediaElementSource(this.props.audioNode);

        this.source.connect(this.analyser);
        this.source.connect(this.audioCtx.destination);
    }
    draw() {
        drawLinearVisualiser(this.ctx, this.canvas.width, this.canvas.height, this.data);
    }
    animate() {
        this.animation = requestAnimationFrame(this.animateBind);

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

let AudioObject = Object;
if (typeof Audio !== 'undefined') {
    AudioObject = Audio;
}

AudioVisualisation.propTypes = {
    audioNode: PropTypes.instanceOf(AudioObject)
};

const mapStateToProps = state => ({
    audioNode: state.getIn(['global', 'audioNode'])
});

export default connect(mapStateToProps)(AudioVisualisation);

