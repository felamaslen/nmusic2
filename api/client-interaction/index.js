const WebSocketServer = require('websocket').server;
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();
const winston = require('winston');
const dns = require('dns');
const joi = require('joi');

if (process.env.NODE_ENV === 'production') {
    winston.remove(winston.transports.Console);
}

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
        .forEach(client => {
            const clientUpdated = client.id === clientId;

            if (clientUpdated) {
                if (type === 'new') {
                    return;
                }

                client.socket.send(JSON.stringify([{ type, clientState, local: true }]));
            }
            else {
                client.socket.send(JSON.stringify([{ type, clientId, clientState }]));
            }
        });

}

function validateState(raw) {
    const rawAsArray = Array.isArray(raw)
        ? raw
        : [raw];

    const itemSchema = joi.object().keys({
        clientId: joi.string(),
        currentSong: joi.object().keys({
            title: joi.string().required(),
            artist: joi.string().required(),
            album: joi.string().required()
        })
            .allow(null),
        paused: joi.boolean()
    });

    const schema = joi.array().items(itemSchema);

    return new Promise((resolve, reject) => {
        joi.validate(rawAsArray, schema, (err, value) => {
            if (err) {
                return reject(err);
            }

            return resolve(value);
        });
    });
}

function updateState(newState, fromClientId) {
    const clientId = newState.clientId || fromClientId;

    const clientIndex = globalState.clients.findIndex(client => client.id === clientId);

    globalState.clients[clientIndex].setState(newState);

    notifyClients(clientId, newState);
}

function onMessage(clientId) {
    return async message => {
        try {
            const states = await validateState(JSON.parse(message.utf8Data), clientId);

            winston.log('info', `Message from client #${clientId}:`, JSON.stringify(states));

            states.forEach(state => updateState(state, clientId));
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
    if (globalState.clients.length > 0) {
        socket.send(JSON.stringify(globalState.clients.map(client => ({
            type: 'new',
            clientId: client.id,
            clientState: client.state
        }))));
    }

    // add new client to the state and notify existing clients of the addition
    globalState.clients.push(newClient);
    notifyClients(id, newClient.state, 'new');

    socket.on('message', onMessage(id, socket));

    socket.on('close', onClose(id));
}

function setupWebSockets(httpServer) {
    const secure = (process.env.WEB_URI || '').indexOf('https://') === 0;

    const wss = new WebSocketServer({
        httpServer,
        secure,
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

