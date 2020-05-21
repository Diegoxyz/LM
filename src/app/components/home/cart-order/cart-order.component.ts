import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from '@app/models/order';

@Component({selector: 'app-cart-order',
templateUrl: './cart-order.component.html',
styleUrls: ['./cart-order.component.css']
})
export class CartOrderComponent implements OnInit {

    @Input()
    order : Order;

    @Output() newOrder = new EventEmitter<Order>();

    totalPrice : number = 0;

    constructor() {

    } 

    ngOnInit(): void {
        if (this.order) {
            this.totalPrice = this.order.quantity * this.order.product.price;
        }
    }

    onChangeQuantity(value : any) {
        this.order.quantity = value;
        this.totalPrice = this.order.quantity * this.order.product.price;
        this.newOrder.emit(this.order);
    }

}