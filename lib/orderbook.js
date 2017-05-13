class OrderBook {
    constructor() {
        this.store = {};
        this.onOrderEvent = this.onOrderEvent.bind(this);
        this.getTop = this.getTop.bind(this);
    }

    onOrderEvent(orderEvent) {
        switch (orderEvent.Type) {
        case 0: // new
        case 2: // update
            this.store[orderEvent.Rate] = {
                rate: orderEvent.Rate,
                quantity: orderEvent.Quantity
            };
            break;
        case 1: // delete
            if (this.store.hasOwnProperty(orderEvent.Rate)) {
                delete this.store[orderEvent.Rate];
            }
            break;
        default:
            console.err('unknown type given', orderEvent.Type);
            break;
        }
    }

    getTop(limit) {
        console.err('no getTop method defined for this class');
    }
}

module.exports = OrderBook;
