const BittrexConnection = require('./connection')
const Market = require('./market')

type MarketName = string

class BittrexOrderBook {
  public markets: {[id: string]: any} = {}
  public conn: any

  constructor () {
    this.setupConn()
  }

  private setupConn () {
    this.conn = new BittrexConnection()

    this.conn.on('updateExchangeState', (update: any) => {
      const market = update.MarketName
      if (this.haveMarket(market)) {
        this.markets[market].onUpdateExchangeState(update)
      }
    })
  }

  public market (market: MarketName) {
    if (!this.haveMarket(market)) {
            // create market now
      this.markets[market] = new Market(market)
      this.conn
                .ready()
                .then(() => this.getInitialState(market))
                .then(() => this.subscribeToMarket(market))
    }
    return this.markets[market]
  }

  subscribeToMarket (market: MarketName) {
    return this.conn.call('SubscribeToExchangeDeltas', market)
  }

  getInitialState (market: MarketName) {
    if (this.haveMarket(market)) {
      return this.conn
                .call('QueryExchangeState', market)
                .then(this.markets[market].onInitialState)
    }
  }

  public haveMarket (market: MarketName): boolean {
    return this.markets.hasOwnProperty(market)
  }
}

export default BittrexOrderBook
