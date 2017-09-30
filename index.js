const BittrexConnection = require('./lib/connection');
const BidOrderBook = require('./lib/bidorderbook');
const AskOrderBook = require('./lib/askorderbook');
const Market = require('./lib/market');

class BittrexOrderBook {
    subscribeToMarket(market) {
        return this.conn.call('SubscribeToExchangeDeltas', market);
    }

    getInitialState(market) {
        if (this.haveMarket(market)) {
            return this.conn
                .call('QueryExchangeState', market)
                .then(this.markets[market].onInitialState);
        }
    }

    setupConn() {
        this.conn = new BittrexConnection;
        this.conn.on('updateExchangeState', (update) => {
            const market = update.MarketName;
            if (this.haveMarket(market)) {
                this.markets[market].onUpdateExchangeState(update);
            }
        });
    }

    haveMarket(market) {
        return this.markets.hasOwnProperty(market);
    }

    market(market) {
        if (!this.haveMarket(market)) {
            // create market now
            this.markets[market] = new Market(market);
            this.conn
                .ready()
                .then(() => this.getInitialState(market))
                .then(() => this.subscribeToMarket(market));
        }
        return this.markets[market];
    }

    constructor() {
        this.markets = {};
        this.setupConn();
    }
}

module.exports = BittrexOrderBook;
