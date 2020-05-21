import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Product } from '@app/models/item';
import { Cart } from '@app/models/cart';
import { Order } from '@app/models/order';
import { AccountService } from '@app/services/account.service';
import { CartService } from '@app/services/cart.service';
import { User } from '@app/models/user';
import { Customer } from '@app/models/customer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({selector: 'app-cart',
templateUrl: './cart.component.html',
styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

    cart : Cart;

    orders : Order[] =[];

    products : Product[] =[];
    
    totalPrice : number = 0;
    totalQuantity : number = 0;

    bsModalRef: BsModalRef;

    config = {
        backdrop: true,
        ignoreBackdropClick: false,
        class: "modal-lg"
    };

    constructor(private accountService : AccountService, private cartService : CartService, private modalService: BsModalService) {

    }
    ngOnInit(): void {
        const user : User = this.accountService.userValue;
        const customer : Customer = {
            firstName : user.username,
            lastName : user.username,
            fiscalCode : 'DCB70F21L736A',
        };
        this.cart = this.cartService.getCart(customer);
        this.orders = this.cart.orders;
        this.orders.forEach(o => {
            if (o.product) {
                this.products.push(o.product);
                this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
            }
            this.totalQuantity = this.totalQuantity + o.quantity;
        })
    }
    ngOnDestroy(): void {
        
    }

    emptyCart(): void {
        this.cartService.emptyCart();
        this.orders = [];
        this.totalQuantity = 0;
        this.totalPrice = 0;
    }

    submitOrder(template: TemplateRef<any>): void {
        this.bsModalRef = this.modalService.show(template, this.config);
    }

    updateOrders(newOrder) {
        if (newOrder) {
            this.totalQuantity = 0;
            this.totalPrice = 0;
            this.orders.forEach(o => {
                if (o.id === newOrder.id) {
                    this.totalPrice = this.totalPrice + (newOrder.product.price * newOrder.quantity);
                    this.totalQuantity = this.totalQuantity + newOrder.quantity;
                } else {
                    this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
                    this.totalQuantity = this.totalQuantity + o.quantity;
                }
            });
        }
    }
}