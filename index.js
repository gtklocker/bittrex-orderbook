const BittrexConnection = require('./lib/connection');
const EventEmitter = require('events');
const BidOrderBook = require('./lib/bidorderbook');
const AskOrderBook = require('./lib/askorderbook');

class BittrexOrderBook extends EventEmitter {
    subscribeToMarket(market) {
        return this.conn.call('SubscribeToExchangeDeltas', market);
    }

    getInitialState(market) {
        return this.conn
            .call('QueryExchangeState', market)
            .then(state => {
                let { Sells, Buys } = state;

                // type 0 means new order
                const addTypeZero = order => {
                    return {
                        Type: 0,
                        ...order
                    };
                };
                Sells = Sells.map(addTypeZero);
                Buys = Buys.map(addTypeZero);
                this.onUpdateExchangeState({
                    Sells,
                    Buys
                });
            })
    }

    onUpdateExchangeState(update) {
        update.Sells.forEach(this.askOrderBook.onOrderEvent);
        if (update.Sells.length > 0) {
            this.emit('askUpdate');
        }

        update.Buys.forEach(this.bidOrderBook.onOrderEvent);
        if (update.Buys.length > 0) {
            this.emit('bidUpdate');
        }
    }

    setupConn() {
        this.conn = new BittrexConnection;
        this.conn.on('updateExchangeState', this.onUpdateExchangeState);

        this.conn
            .connect()
            .then(() => this.getInitialState(this.market))
            .then(() => this.subscribeToMarket(this.market));
    }

    // TODO: allow subscription to multiple markets concurrently
    constructor(market='BTC-XMR') {
        super();

        this.market = market;
        this.bidOrderBook = new BidOrderBook();
        this.askOrderBook = new AskOrderBook();
        this.getTopAsk = this.askOrderBook.getTop;
        this.getTopBid = this.bidOrderBook.getTop;

        this.onUpdateExchangeState = this.onUpdateExchangeState.bind(this);

        this.setupConn();
    }
}

module.exports = BittrexOrderBook;
