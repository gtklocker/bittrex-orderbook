const OrderBook = require('./orderbook');

class BidOrderBook extends OrderBook {
    getTop(limit=1) {
        const rates = Object.keys(this.store).map(key => parseFloat(key));
        rates.sort();
        rates.splice(limit);
        return rates.map(key => this.store[key]);
    }
}

module.exports = BidOrderBook;
