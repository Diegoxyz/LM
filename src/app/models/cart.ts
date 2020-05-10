import { Customer } from './customer';
import { Order } from './order';

export class Cart {
    customer : Customer;

    orders : Order[] = new Order[0];

}