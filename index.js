const WebSocket = require('ws');
const EventEmitter = require('events');
const BidOrderBook = require('./lib/bidorderbook');
const AskOrderBook = require('./lib/askorderbook');

const BITTREX_ENDPOINT = 'wss://socket.bittrex.com/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken=sYd39qp14Y02vUTUFAbbjIoHISnuROjixQA19FejlAi9wj5Ja8B93J7Cl7ILqyeF8tYtZ%2BcUnOiO2aIaeKgNXpzL6hTwr7BH%2B1pnDFvaPML5%2FntG&connectionData=%5B%7B%22name%22%3A%22corehub%22%7D%5D&tid=9';

class BittrexOrderBook extends EventEmitter {
    subscribeToMarket() {
        this.ws.send(`{"H":"corehub","M":"SubscribeToExchangeDeltas","A":["${this.market}"],"I":0}`);
        this.ws.send(`{"H":"corehub","M":"QueryExchangeState","A":["${this.market}"],"I":1}`);
    }

    onMessage(data, flags) {
        const msgs = JSON.parse(data).M;
        if (!msgs) {
            return;
        }

        msgs.forEach((msg) => {
            if (msg.M !== 'updateExchangeState' || !msg.A) {
                return;
            }
            if (msg.A.length !== 1) {
                console.err('unexpected payload length', msg.A.length)
            }

            const payload = msg.A[0];

            payload.Sells.forEach(this.askOrderBook.onOrderEvent);
            if (payload.Sells.length > 0) {
                this.emit('askUpdate');
            }

            payload.Buys.forEach(this.bidOrderBook.onOrderEvent);
            if (payload.Buys.length > 0) {
                this.emit('bidUpdate');
            }
        });
    }

    setupWs() {
        this.ws = new WebSocket(BITTREX_ENDPOINT);

        this.ws.on('open', () => {
            this.subscribeToMarket();
        });

        this.ws.on('message', this.onMessage.bind(this));
    }

    // TODO: allow subscription to multiple markets concurrently
    constructor(market='BTC-XMR') {
        super();

        this.market = market;
        this.bidOrderBook = new BidOrderBook();
        this.askOrderBook = new AskOrderBook();
        this.getTopAsk = this.askOrderBook.getTop;
        this.getTopBid = this.bidOrderBook.getTop;

        this.setupWs();
    }
}

module.exports = BittrexOrderBook;
