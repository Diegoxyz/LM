import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from '@app/models/order';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { CatalogueService } from '@app/services/catalogue.service';
import { environment } from '@environments/environment';
import { CarrelloService } from '@app/services/carrello.service';
import { AccountService } from '@app/services/account.service';
import { ManageProducts } from '../services/manage-products.service';
import { Carrello } from '@app/models/carrello';

@Component({selector: 'app-cart-order',
templateUrl: './cart-order.component.html',
styleUrls: ['./cart-order.component.css']
})
export class CartOrderComponent implements OnInit {

    @Input()
    order : Order;

    @Output() newOrder = new EventEmitter<Order>();
    @Output() deleteOrder = new EventEmitter<Order>();

    totalPrice : number = 0;

    faTrash = faTrashAlt;

    isError = false;

    constructor(private accountService: AccountService, private catalogueService : CatalogueService, 
        private carrelloService : CarrelloService, private manageProducts: ManageProducts) {

    } 

    public getPrice(price : number) : string {
        console.log('getPrice - price:' + price);
        if (price) {
            return Number(price).toFixed(2);
        }
        return '0.00';
    }

    ngOnInit(): void {
        if (this.order) {
            
            if (environment && environment.oData) {
                this.isError = this.order.error !== undefined;
                console.log('this.order.product.code:' + this.order.product.code);
                console.log('this.order.product.price:' + this.order.product.price );
                this.catalogueService.getItem(this.order.product.code).subscribe(p => {
                    if (p && p.body && p.body.d) {
                        this.order.product.price = p.body.d.Netpr;
                        console.log('this.order.product.code:' + this.order.product.code + ',p.body.d.Netpr:' + p.body.d.Netpr + ',o.product.price:' + this.order.product.price);
                        this.order.product.currency = p.body.d.Waers;
                        console.log('this.order.quantity:' + this.order.quantity);
                        this.totalPrice = this.order.quantity * this.order.product.price;
                    }
                    
                })
            } else {
                this.isError = false;
            }
        }
    }

    onChangeQuantity(value : any) {
        if (value) {

        }
        const qty = value;
        if (environment && environment.oData) {
            this.accountService.fetchToken().subscribe(
                response1 => {
                    if (response1.headers) {
                        const csrftoken : string = response1.headers.get('X-CSRF-Token');
                        if (qty > 0) { // Update
                            const carrello : Carrello = new Carrello();
                            carrello.Matnr = this.order.product.code;
                            carrello.Menge = '' + qty;
                            this.carrelloService.updateCart(csrftoken, carrello).subscribe(d => {
                                console.log('update went fine');
                                this.manageProducts.changeProduct(this.order.product,qty);
                                this.order.quantity = value;
                                this.totalPrice = this.order.quantity * this.order.product.price;
                                this.newOrder.emit(this.order);
                            },
                            error => {
                                console.log('error update:' + error);
                            })
                        } else { // delete
                            this.carrelloService.deleteFromCarrello(csrftoken, this.order.product.code).subscribe(d => {
                                console.log('delete went fine');
                                this.manageProducts.changeProduct(this.order.product,qty);
                                this.order.quantity = 0;
                                this.totalPrice = this.order.quantity * this.order.product.price;
                                this.newOrder.emit(this.order);
                            },
                            error => {
                                console.log('error delete:' + error);
                            });
                        }
                    }
                    
                }, error => {
                    console.log('error:' + error);
                });
            
        } else {
            this.order.quantity = value;
            this.totalPrice = this.order.quantity * this.order.product.price;
            this.newOrder.emit(this.order);
        }
    }

    onDeleteOrder() {
        if (environment && environment.oData) {
            this.accountService.fetchToken().subscribe(
                response1 => {
                    if (response1.headers) {
                        const csrftoken : string = response1.headers.get('X-CSRF-Token');
                        this.carrelloService.deleteFromCarrello(csrftoken, this.order.product.code).subscribe(d => {
                            console.log('delete went fine');
                            this.manageProducts.changeProduct(this.order.product,0);
                            this.order.quantity = 0;
                            this.totalPrice = this.order.quantity * this.order.product.price;
                            this.newOrder.emit(this.order);
                        },
                        error => {
                            console.log('error delete:' + error);
                        });
                    }
                });
        }
        
        this.deleteOrder.next(this.order);
    }
}