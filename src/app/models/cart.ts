import { Customer } from './customer';
import { Order } from './order';
import { User } from './user';
import { Carrello } from './carrello';
import { UserDataSet } from './OData/UserDataSet/userdataset.entity';
import { Product } from './item';

export class Cart {
    customer : Customer;

    // Just for test
    orders : Order[] = [];

    public static fromCarrello(carrello : Carrello[], u: UserDataSet) : Cart {
        const cart : Cart = new Cart();

        cart.customer = new Customer();
        cart.customer.lastName = u.Kunnrx;

        const orders : Order[] = [];
        carrello.forEach(c => {
            const order : Order = new Order();
            order.id = c.Matnr;

            const product : Product = new Product(c.Matnr, c.Maktx, 0, '', true,'Gerarchia','',c.Meins);
            order.product = product;

            order.quantity = Number(c.Menge);

            orders.push(order);
        });
        cart.orders = orders;

        return cart;
    }
}