# bittrex-orderbook

## Installation

```
npm install bittrex-orderbook
```

## Usage

```
const BittrexOrderBook = require('bittrex-orderbook');
const bit = new BittrexOrderBook();

bit.on('askUpdate', () => {
    console.log('updated ask orderbook', bit.getTopAsk(5));
});

bit.on('bidUpdate', () => {
    console.log('updated bid orderbook', bit.getTopBid(5));
});
```

## TODO

* Ensure integrity with nonce.
