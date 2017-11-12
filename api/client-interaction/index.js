const WebSocketServer = require('websocket').server;
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();
const winston = require('winston');

const uuid = () => uid.randomUUID(6);

class Client {
    constructor(id, origin, socket) {
        this.id = id;
        this.origin = origin;
        this.socket = socket;

        this.state = {
            origin,
            currentSong: null,
            playTime: null
        };
    }
    setState(state) {
        this.state = { ...this.state, ...state };
    }
}

const globalState = {
    clients: []
};

function notifyClients(clientId, clientState, type = 'update') {
    // a client updated its state, notify all other clients
    winston.log('info', `Notifying clients of ${type} client:`, { clientId, clientState });

    globalState.clients
        .filter(client => client.id !== clientId)
        .forEach(client => client.socket.send(JSON.stringify([{ type, clientId, clientState }])));
}

const validState = () => true;

function onMessage(id) {
    return message => {
        try {
            const state = JSON.parse(message.utf8Data);

            winston.log('info', `Message from client #${id}: state -> `, JSON.stringify(state));

            if (validState(state)) {
                notifyClients(id, state);
            }
        }
        catch (err) {
            winston.log('warn', `Error processing message from client #${id}:`, err.message);
        }
    };
}

function onClose(clientId) {
    return () => {
        winston.log('info', `Closing connection from #${clientId}`);

        const clientKey = globalState.clients.findIndex(client => clientId === client.id);

        globalState.clients.splice(clientKey, 1);

        notifyClients(clientId, null, 'close');
    };
}

function originIsAllowed() {
    return true;
}

function getPlatform(req) {
    const userAgent = req.httpRequest.headers['user-agent'] || 'null-user-agent';

    const matchChrome = userAgent.match(/(Chrome\/[\w.]+)/);
    if (matchChrome) {
        return matchChrome[1];
    }

    const matchFirefox = userAgent.match(/(Firefox\/[\w.]+)/);
    if (matchFirefox) {
        return matchFirefox[1];
    }

    return userAgent;
}

function getOrigin(req) {
    const origin = req.origin;
    const platform = getPlatform(req);

    return `${origin} (${platform})`;
}

function onConnection(req) {
    if (!originIsAllowed(req.origin)) {
        req.reject();
        winston.log('warn', 'Rejected client due to bad origin');

        return;
    }

    const id = uuid();
    const origin = getOrigin(req);

    const socket = req.accept('echo-protocol', origin);

    const newClient = new Client(id, origin, socket);

    winston.log('info', 'New client', { id, origin });

    // send list of connected clients to the new client
    socket.send(JSON.stringify(globalState.clients.map(client => ({
        type: 'new',
        clientId: client.id,
        clientState: client.state
    }))));

    // add new client to the state and notify existing clients of the addition
    globalState.clients.push(newClient);
    notifyClients(id, newClient.state, 'new');

    socket.on('message', onMessage(id, socket));

    socket.on('close', onClose(id));
}

function setupWebSockets(httpServer) {
    const wss = new WebSocketServer({
        httpServer,
        autoAcceptConnections: false
    });

    wss.on('request', onConnection);
}

function init(app) {
    setupWebSockets(app);
}

module.exports = {
    init
};

