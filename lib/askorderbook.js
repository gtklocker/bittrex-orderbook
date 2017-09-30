const OrderBook = require('./orderbook');

class AskOrderBook extends OrderBook {
    top(limit=1) {
        const rates = Object.values(this.store).map(o => o.rate);
        rates.sort((a, b) => a - b);
        rates.splice(limit);
        return rates.map(key => this.store[key]);
    }
}

module.exports = AskOrderBook;
