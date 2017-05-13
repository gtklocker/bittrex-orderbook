const WebSocket = require('ws');

const ws = new WebSocket('wss://socket.bittrex.com/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken=sYd39qp14Y02vUTUFAbbjIoHISnuROjixQA19FejlAi9wj5Ja8B93J7Cl7ILqyeF8tYtZ%2BcUnOiO2aIaeKgNXpzL6hTwr7BH%2B1pnDFvaPML5%2FntG&connectionData=%5B%7B%22name%22%3A%22corehub%22%7D%5D&tid=9');

ws.on('open', () => {
    console.log('socket opened');
    ws.send('{"H":"corehub","M":"SubscribeToExchangeDeltas","A":["BTC-XMR"],"I":0}');
    ws.send('{"H":"corehub","M":"QueryExchangeState","A":["BTC-XMR"],"I":1}');
    console.log('sent subscription messages');
});

const sellsStore = {};

const getTopOfOrderBook = (limit) => {
    const rates = Object.keys(sellsStore).map(key => parseFloat(key));
    rates.sort();
    rates.splice(limit);
    return rates.map(key => sellsStore[key]);
};

ws.on('message', (data, flags) => {
    data = JSON.parse(data);
    const msgs = data.M;
    if (!msgs) {
        return;
    }

    msgs.forEach((msg) => {
        if (msg.M !== 'updateExchangeState') {
            return;
        }
        //console.log('got msg', msg)
        if (!msg.A) {
            return;
        }
        if (msg.A.length !== 1) {
            console.err('unexpected payload length', msg.A.length)
        }

        const payload = msg.A[0];

        console.log('got payload', payload);
        payload.Sells.forEach((sell) => {
            switch (sell.Type) {
            case 0: // new
            case 2: // update
                sellsStore[sell.Rate] = {
                    rate: sell.Rate,
                    quantity: sell.Quantity
                };
                break;
            case 1: // delete
                if (sellsStore.hasOwnProperty(sell.Rate)) {
                    delete sellsStore[sell.Rate];
                }
                break;
            default:
                console.err('unknown type given', sell.Type)
                break;
            }
        });

        console.log('top of order book', getTopOfOrderBook(2));
    });
});
