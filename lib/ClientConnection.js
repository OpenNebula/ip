const { parse } = require('url');
const DeepExtend = require('deep-extend');
const { DateTime } = require('luxon')

const GuacdClient = require('./GuacdClient.js');
const Crypt = require('./Crypt.js');

class ClientConnection {

    constructor(server, connectionId, webSocket) {
        this.STATE_OPEN = 1;
        this.STATE_CLOSED = 2;

        this.state = this.STATE_OPEN;

        this.server = server;
        this.connectionId = connectionId;
        this.webSocket = webSocket;
        this.query = parse(this.webSocket.upgradeReq.url, true).query;
        this.lastActivity = Date.now();

        this.log(this.server.LOGLEVEL.VERBOSE, 'Client connection open');

        try {
            this.connectionSettings = this.decryptToken();

            this.connectionType = this.connectionSettings.connection.type;

            this.connectionSettings['connection'] = this.mergeConnectionOptions();

        } catch (error) {
            this.log(this.server.LOGLEVEL.ERRORS, 'Token validation failed');
            this.close(error);
            return;
        }

        server.callbacks.processConnectionSettings(
            this.connectionSettings, 
            (err, settings) => {
                if (err) {
                    return this.close(err);
                }

                this.connectionSettings = settings;

                this.log(this.server.LOGLEVEL.VERBOSE, 'Opening guacd connection');

                this.guacdClient = new GuacdClient(server, this);

                webSocket.on('close', ()=> this.close.bind(this));
                webSocket.on('message', this.processReceivedMessage.bind(this));

                this.activityCheckInterval = setInterval(this.checkActivity.bind(this), 1000);
            },
            {
                connections: this.server.activeConnections,
                id: this.connectionId
            }
        );
    }

    decryptToken() {
        const crypt = new Crypt(this.server);

        const encrypted = this.query.token;
        delete this.query.token;

        return crypt.decrypt(encrypted);
    }

    log(level, ...args) {
        if (level > this.server.clientOptions.log.level) {
            return;
        }

        const stdLogFunc = this.server.clientOptions.log.stdLog;
        const errorLogFunc = this.server.clientOptions.log.errorLog;

        let logFunc = stdLogFunc;
        if (level === this.server.LOGLEVEL.ERRORS) {
            logFunc = errorLogFunc;
        }

        logFunc(this.getLogPrefix(), ...args);
    }

    getLogPrefix() {
        const now = DateTime.local()
        return '[' + now.toFormat("yyyy-MM-DD HH:mm:ss") + '] [Connection ' + this.connectionId + '] ';
    }

    close(error) {
        if (this.state == this.STATE_CLOSED) {
            return;
        }

        clearInterval(this.activityCheckInterval);

        if (error) {
            this.log(this.server.LOGLEVEL.ERRORS, 'Closing connection with error: ', error);
        }

        if (this.guacdClient) {
            this.guacdClient.close();
        }

        this.webSocket.removeAllListeners('close');
        this.webSocket.close();

        const dataConnection = this.server.activeConnections.get(this.connectionId)
        this.server.activeConnections.delete(this.connectionId);

        this.state = this.STATE_CLOSED;

        this.log(this.server.LOGLEVEL.VERBOSE, 'Client connection closed');
        this.server.callbacks.processConnectionClose(error, {
            connections: this.server.activeConnections,
            id: dataConnection.pidTunnel
        });
    }

    error(error) {
        this.server.emit('error', this, error);
        this.close(error);
    }

    processReceivedMessage(message) {
        this.lastActivity = Date.now();
        this.guacdClient.send(message);
    }

    send(message) {
        if (this.state == this.STATE_CLOSED) {
            return;
        }

        this.log(this.server.LOGLEVEL.DEBUG, '>>>G2W> ' + message + '###');
        this.webSocket.send(message, {binary: false, mask: false}, (error) => {
            if (error) {
                this.close(error);
            }
        });
    }

    mergeConnectionOptions() {
        let unencryptedConnectionSettings = {};

        Object
            .keys(this.query)
            .filter(key => this.server.clientOptions.allowedUnencryptedConnectionSettings[this.connectionType].includes(key))
            .forEach(key => unencryptedConnectionSettings[key] = this.query[key]);

        let compiledSettings = {};

        DeepExtend(
            compiledSettings,
            this.server.clientOptions.connectionDefaultSettings[this.connectionType],
            this.connectionSettings.connection.settings,
            unencryptedConnectionSettings
        );

        return compiledSettings;
    }

    checkActivity() {
        if (Date.now() > (this.lastActivity + 10000)) {
            this.close(new Error('WS was inactive for too long'));
        }
    }


}

module.exports = ClientConnection;