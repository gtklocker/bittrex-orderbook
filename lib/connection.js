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
    
    connect() {
        return new Promise((resolve, reject) => {
            this.client.serviceHandlers.connected = resolve;
            this.client.serviceHandlers.connectFailed = reject;

            this.client.start();
        });
    }

    constructor() {
        this.client = new singalR.client(
            'wss://socket.bittrex.com/signalr',     // url
            ['CoreHub'],                            // hubs
            undefined,                              // reconnection timeout
            true                                    // don't start automatically
        );
    }
}

module.exports = BittrexConnection;
