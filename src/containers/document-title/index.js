import { connect } from 'react-redux';
import { Component } from 'react';
import PropTypes from 'prop-types';

class DocumentTitle extends Component {
    componentDidMount() {
        document.title = this.props.title;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.title !== this.props.title) {
            document.title = this.props.title;
        }
    }
    render() {
        return null;
    }
}

DocumentTitle.propTypes = {
    title: PropTypes.string.isRequired
};

export default connect(state => ({
    title: state.get('title').join(' ')
}))(DocumentTitle);

