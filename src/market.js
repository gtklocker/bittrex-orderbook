const assert = require('assert');
const EventEmitter = require('events');
const BidOrderBook = require('./bidorderbook');
const AskOrderBook = require('./askorderbook');

class Market extends EventEmitter {
    onInitialState(state) {
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
    }

    onUpdateExchangeState(update) {
        update.Sells.forEach(this.asks.onOrderEvent);
        if (update.Sells.length > 0) {
            this.emit('askUpdate', this);
        }

        update.Buys.forEach(this.bids.onOrderEvent);
        if (update.Buys.length > 0) {
            this.emit('bidUpdate', this);
        }
    }

    constructor(name) {
        super();

        this.onInitialState = this.onInitialState.bind(this);
        this.onUpdateExchangeState = this.onUpdateExchangeState.bind(this);

        this.name = name;
        this.bids = new BidOrderBook();
        this.asks = new AskOrderBook();
    }
}

module.exports = Market;
