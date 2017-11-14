const WebSocketServer = require('websocket').server;
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();
const winston = require('winston');
const dns = require('dns');
const joi = require('joi');

if (process.env.DNS_SERVERS) {
    dns.setServers([process.env.DNS_SERVERS]);
}

const uuid = () => uid.randomUUID(6);

class Client {
    constructor(id, origin, socket) {
        this.id = id;
        this.origin = origin;
        this.socket = socket;

        this.state = {
            origin,
            currentSong: null
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

function validateState(raw) {
    const schema = joi.object().keys({
        currentSong: joi.object().keys({
            title: joi.string().required(),
            artist: joi.string().required(),
            album: joi.string().required()
        }),
        paused: joi.boolean()
    });

    return new Promise((resolve, reject) => {
        joi.validate(raw, schema, (err, value) => {
            if (err) {
                return reject(err);
            }

            return resolve(value);
        });
    });
}

function onMessage(clientId) {
    return async message => {
        try {
            const state = await validateState(JSON.parse(message.utf8Data));

            winston.log('info', `Message from client #${clientId}: state -> `, JSON.stringify(state));

            const clientIndex = globalState.clients.findIndex(client => client.id === clientId);

            globalState.clients[clientIndex].setState(state);

            notifyClients(clientId, state);
        }
        catch (err) {
            winston.log('warn', `Error processing message from client #${clientId}:`, err.message);
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

function getRemoteIp(req) {
    if (req.httpRequest.headers && req.httpRequest.headers['x-forwarded-for']) {
        return req.httpRequest.headers['x-forwarded-for'];
    }

    return req.httpRequest.connection.remoteAddress;
}

function getRemoteHostname(req) {
    const ip = getRemoteIp(req);

    return new Promise(resolve => {
        dns.reverse(ip, (err, hostnames) => {
            if (err) {
                return resolve(ip);
            }

            return resolve(hostnames[0]);
        });
    });
}

async function getOrigin(req) {
    const hostname = await getRemoteHostname(req);
    const platform = getPlatform(req);

    return `${hostname} (${platform})`;
}

async function onConnection(req) {
    if (!originIsAllowed(req.origin)) {
        req.reject();
        winston.log('warn', 'Rejected client due to bad origin');

        return;
    }

    const id = uuid();
    const origin = await getOrigin(req);

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

