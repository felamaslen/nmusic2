import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';
import ImmutableComponent from '../../ImmutableComponent';

export class AudioVisualisation extends ImmutableComponent {
    render() {
        if (!this.props.data) {
            return <span>no data</span>;
        }

        const sum = this.props.data.reduce((value, item) => value + item, 0);

        return <span>{sum}</span>;
    }
}

AudioVisualisation.propTypes = {
    data: PropTypes.instanceOf(Uint8Array)
};

const mapStateToProps = state => ({
    data: state.getIn(['analyser', 'frequencyData'])
});

export default connect(mapStateToProps)(AudioVisualisation);

