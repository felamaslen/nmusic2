import { connect } from 'react-redux';

import { uiReset } from '../../actions/ui-reset.actions';

import { Component } from 'react';
import PropTypes from 'prop-types';

export class UIReset extends Component {
    constructor(props) {
        super(props);

        this.resetListener = () => this.props.reset();
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.resetListener);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.resetListener);
    }
    render() {
        return null;
    }
}

UIReset.propTypes = {
    reset: PropTypes.func.isRequired
};

export default connect(null, dispatch => ({
    reset: () => dispatch(uiReset())
}))(UIReset);

