import OrderBook, { OrderBookRecord } from './orderbook'

class AskOrderBook extends OrderBook {
  top (limit = 1): OrderBookRecord[] {
    const rates = Object.values(this.store).map(o => o.rate)

    rates.sort((a, b) => a - b)
    rates.splice(limit)

    return rates.map(key => this.store[key])
  }
}

export default AskOrderBook
