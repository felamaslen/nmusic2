import { Map as map } from 'immutable';
import { connect } from 'react-redux';
import { w3cwebsocket as WebSocket } from 'websocket';

import { socketErrorOccurred, socketStateUpdated } from '../../actions/socket.actions';

import PureComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class SocketUpdates extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.socket = new WebSocket(`ws://${process.env.WEB_URI}`, 'echo-protocol');

        this.socket.onopen = () => this.setState({ open: true });

        this.socket.onerror = err => this.props.onError(err);

        this.socket.onmessage = evt => this.props.onMessage(evt);

        this.socket.onclose = () => this.setState({ open: false });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.open && prevState.open && this.socket.readyState === this.socket.OPEN) {
            this.socket.send(JSON.stringify(this.props.localState.toJS()));
        }
    }
    componentWillUnmount() {
        this.socket.close();
    }
    render() {
        return null;
    }
}

SocketUpdates.propTypes = {
    localState: PropTypes.instanceOf(map),
    onError: PropTypes.func.isRequired,
    onMessage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    localState: state.getIn(['cloud', 'localState'])
});

const mapDispatchToProps = dispatch => ({
    onError: err => dispatch(socketErrorOccurred(err)),
    onMessage: data => dispatch(socketStateUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SocketUpdates);

