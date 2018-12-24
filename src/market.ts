import BidOrderBook from './bidorderbook'
import AskOrderBook from './askorderbook'
import { OrderBookRecord } from './orderbook'
import EventEmitter from 'events'

type MarketName = string

type Fill = {
  Id: number,
  TimeStamp: string,
  Quantity: number,
  Price: number,
  Total: number,
  FillType: 'FILL' | 'PARTIAL_FILL',
  OrderType: 'BUY' | 'SELL'
}

type OrderBookState = {
  Buys: OrderBookRecord[]
  Sells: OrderBookRecord[],
  Fills: Fill[]
}

class Market extends EventEmitter {
  public name: MarketName
  public bids: BidOrderBook
  public asks: AskOrderBook

  constructor (name: MarketName) {
    super()

    this.onInitialState = this.onInitialState.bind(this)
    this.onUpdateExchangeState = this.onUpdateExchangeState.bind(this)

    this.name = name
    this.bids = new BidOrderBook()
    this.asks = new AskOrderBook()
  }

  onInitialState (state: OrderBookState): void {
    let { Sells, Buys } = state

    // type 0 means new order
    const addTypeZero = (order) => {
      return {
        Type: 0,
        ...order
      }
    }
    Sells = Sells.map(addTypeZero)
    Buys = Buys.map(addTypeZero)
    this.onUpdateExchangeState({
      Sells,
      Buys
    })
  }

  onUpdateExchangeState (update): void {
    update.Sells.forEach(this.asks.onOrderEvent)
    if (update.Sells.length > 0) {
      this.emit('askUpdate', this)
    }

    update.Buys.forEach(this.bids.onOrderEvent)
    if (update.Buys.length > 0) {
      this.emit('bidUpdate', this)
    }
  }
}

export default Market
