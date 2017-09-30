const winston = require('winston');
const singalR = require('signalr-client');

class BittrexConnection {
    // TODO(gtklocker): handle case where client disconnects mid-operation
    on(evt, cb) {
        this.client.on('CoreHub', evt, cb);
    }

    call(method, ...args) {
        const callRepr = `${method}(${args.join(', ')})`;
        return new Promise((resolve, reject) => {
            winston.debug('Calling', callRepr);
            this.client
                .call('CoreHub', method, ...args)
                .done((err, res) => {
                    if (err) {
                        winston.debug(callRepr, 'returned with error', err);
                        reject(err);
                    }

                    if (res) {
                        winston.debug(callRepr, 'succeeded with ', res);
                        resolve(res);
                    }
                });
        });
    }
    
    ready() {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                resolve();
                return;
            }
            else {
                this.awaitingClients.push({
                    resolve,
                    reject
                });
            }
        });
    }

    constructor() {
        this.client = new singalR.client(
            'wss://socket.bittrex.com/signalr',     // url
            ['CoreHub'],                            // hubs
            undefined,                              // reconnection timeout
            true                                    // don't start automatically
        );

        this.awaitingClients = [];
        this.isConnected = false;

        this.client.serviceHandlers.connected = () => {
            this.isConnected = true;

            let client;
            while ((client = this.awaitingClients.pop()) !== undefined) {
                client.resolve();
            }
        };
        this.client.serviceHandlers.connectFailed = () => {
            let client;
            while ((client = this.awaitingClients.pop()) !== undefined) {
                client.reject();
            }
        };
        this.client.start();
    }
}

module.exports = BittrexConnection;
