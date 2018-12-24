const OrderBook = require('./orderbook')

class BidOrderBook extends OrderBook {
  top (limit= 1) {
    const rates = Object.values(this.store).map(o => o.rate)
    rates.sort((a, b) => b - a)
    rates.splice(limit)
    return rates.map(key => this.store[key])
  }
}

module.exports = BidOrderBook
