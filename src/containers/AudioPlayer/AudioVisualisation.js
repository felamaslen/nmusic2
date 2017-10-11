import { List as list } from 'immutable';
import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';
import ImmutableComponent from '../../ImmutableComponent';

export class AudioVisualisation extends ImmutableComponent {
    getValues() {
        if (!this.props.data || !this.props.data.length) {
            return new Array(64).fill(0);
        }

        return this.props.data.map(item => 100 * item / 255);
    }
    render() {
        const values = this.getValues();

        const bars = list(values).map((value, key) => {
            const style = { height: `${value}%` };

            return <span key={key} className="bar" style={style} />;
        });

        return <span className="visualiser">{bars}</span>;
    }
}

AudioVisualisation.propTypes = {
    data: PropTypes.instanceOf(Uint8Array)
};

const mapStateToProps = state => ({
    data: state.getIn(['analyser', 'frequencyData'])
});

export default connect(mapStateToProps)(AudioVisualisation);

