# bittrex-orderbook

## Installation

```
npm install bittrex-orderbook
```

## Usage

```javascript
const BittrexOrderBook = require('bittrex-orderbook');
const bit = new BittrexOrderBook;

bit.market('BTC-XMR').on('bidUpdate', (market) => {
    console.log('XMR bids', market.bids.top(5));
});
bit.market('BTC-ETH').on('askUpdate', (market) => {
    console.log('ETH asks', market.asks.top(5));
});
```
