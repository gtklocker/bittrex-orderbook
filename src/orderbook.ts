export type OrderBookRecord = {
  rate: number,
  quantity: number
}

// {key: Rate => OrderBookRecord}
type OrderBookTable = {[key: string]: OrderBookRecord}

abstract class OrderBook {
  public store: OrderBookTable = {}

  constructor () {
    this.onOrderEvent = this.onOrderEvent.bind(this)
    this.top = this.top.bind(this)
  }

  onOrderEvent (orderEvent: any): void {
    switch (orderEvent.Type) {
      case 0: // new
      case 2: // update
        this.store[orderEvent.Rate] = {
          rate: orderEvent.Rate,
          quantity: orderEvent.Quantity
        }
        break
      case 1: // delete
        if (this.store.hasOwnProperty(orderEvent.Rate)) {
          delete this.store[orderEvent.Rate]
        }
        break
      default:
        console.log('unknown type given', orderEvent.Type)
        break
    }
  }

  abstract top (limit: number): OrderBookRecord[]
}

export default OrderBook
