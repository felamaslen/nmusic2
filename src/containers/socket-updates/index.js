import { Map as map, List as list } from 'immutable';
import { connect } from 'react-redux';
import { w3cwebsocket as WebSocket } from 'websocket';

import { getWSUrl } from '../../helpers';
import { socketErrorOccurred, socketStateUpdated } from '../../actions/socket.actions';

import PureComponent from '../../ImmutableComponent';
import PropTypes from 'prop-types';

export class SocketUpdates extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.mounted = false;

        const wsUrl = getWSUrl(process.env.WEB_URI);

        this.socket = new WebSocket(wsUrl, 'echo-protocol');

        this.socket.onopen = () => this.mounted && this.setState({ open: true });

        this.socket.onerror = err => this.props.onError(err);

        this.socket.onmessage = evt => this.props.onMessage(evt);

        this.socket.onclose = () => this.mounted && this.setState({ open: false });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.open && prevState.open && this.socket.readyState === this.socket.OPEN) {
            if (!this.props.localState.equals(prevProps.localState)) {
                this.socket.send(JSON.stringify(this.props.localState.toJS()));
            }
            else if (!this.props.newStates.equals(prevProps.newStates)) {
                this.socket.send(JSON.stringify(this.props.newStates.toJS()));
            }
        }
    }
    componentDidMount() {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
        this.socket.close();
    }
    render() {
        return null;
    }
}

SocketUpdates.propTypes = {
    localState: PropTypes.instanceOf(map).isRequired,
    newStates: PropTypes.instanceOf(list).isRequired,
    onError: PropTypes.func.isRequired,
    onMessage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    localState: state.getIn(['cloud', 'localState']),
    newStates: state.getIn(['cloud', 'newStates'])
});

const mapDispatchToProps = dispatch => ({
    onError: err => dispatch(socketErrorOccurred(err)),
    onMessage: data => dispatch(socketStateUpdated(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SocketUpdates);

