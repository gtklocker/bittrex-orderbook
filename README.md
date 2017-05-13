# bittrex-orderbook

## Installation
Install with

```
npm install bittrex-orderbook
```

## Usage

```
const BittrexOrderBook = require('bittrex-orderbook');
const bit = new BittrexOrderBook();

bit.on('askUpdate', () => {
    console.log('updated ask orderbook', bit.getTopAsk());
});

bit.on('bidUpdate', () => {
    console.log('updated bid orderbook', bit.getTopBid());
});
```
