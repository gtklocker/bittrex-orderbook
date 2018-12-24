const assert = require('assert');
const BittrexOrderBook = require('../src/');

describe('bittrex-orderbook', function() {
    const PAIR = 'USD-BTC';

    this.timeout(8000);

    it('gets bids', function(done) {
	const bit = new BittrexOrderBook;
	bit.market(PAIR).on('bidUpdate', mkt => {
	    assert(mkt.bids.top(5).length === 5);
	    done();
	});
    });

    it('gets asks', function(done) {
	const bit = new BittrexOrderBook;
	bit.market(PAIR).on('askUpdate', mkt => {
	    assert(mkt.asks.top(5).length === 5);
	    done();
	});
    });
});
