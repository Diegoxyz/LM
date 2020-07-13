import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Product } from '@app/models/item';
import { Cart } from '@app/models/cart';
import { Order } from '@app/models/order';
import { AccountService } from '@app/services/account.service';
import { CartService } from '@app/services/cart.service';
import { User } from '@app/models/user';
import { Customer } from '@app/models/customer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { CarrelloService } from '@app/services/carrello.service';
import { HandledProduct } from './services/handled-product';
import { ManageProducts } from './services/manage-products.service';
import { CatalogueService } from '@app/services/catalogue.service';

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

    currency : string = undefined;

    constructor(private accountService : AccountService, private cartService : CartService, private modalService: BsModalService, 
        private router: Router, private manageProducts : ManageProducts, private carrelloService: CarrelloService, 
        private userDataSetService : UserDataSetService, private catalogueService : CatalogueService) {

    }
    ngOnInit(): void {
        const user : User = this.accountService.userValue;

        if (!this.accountService.isSessionStillValid()) {
            this.accountService.logout();
            setTimeout(
              () => this.router.navigate(['/account/login']),
              100
            );
          }
        if (environment && environment.oData && this.accountService.user !== undefined && this.accountService.user !== null) {
            this.carrelloService.getCart().subscribe(resp => {
                console.log('cart.component - this.carrelloService.getCart -' + resp);
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                  this.cart = Cart.fromCarrello(resp.body.d.results, this.userDataSetService.userDataSetValue);
                  this.cartService.setCart(this.cart);
                  this.orders = this.cart.orders;
                        this.orders.forEach(o => {
                            if (o.product) {
                                this.catalogueService.getItem(o.product.code).subscribe(p => {
                                    if (p && p.body && p.body.d) {
                                        o.product.price = p.body.d.Netpr;
                                        console.log('o.product.code:' + o.product.code + ',p.body.d.Netpr:' + p.body.d.Netpr + ',o.product.price:' + o.product.price);
                                        o.product.currency = p.body.d.Waers;
                                        if (this.currency === undefined) {
                                            this.currency = o.product.currency;
                                        }
                                        this.products.push(o.product);
                                        this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
                                        this.totalQuantity = this.totalQuantity + o.quantity;
                                    }
                                    
                                })
                                
                            }
                            
                        });
                }
              });
              
              /*if (this.accountService.isSessionStillValid()) {
                console.log('cart.component - cart2:' + this.cartService.loadCart());
                this.cartService.cart$.subscribe((o : Order) => {
                  console.log('cart.component - this.cartService.cart$ : o:' + o);
                  if (o) {
                    this.carrelloService.getCart().subscribe(resp => {
                      console.log('cart.component - this.carrelloService.getCart2 -' + resp);
                      if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                        this.cart = Cart.fromCarrello(resp.body.d.results, this.userDataSetService.userDataSetValue);
                        this.cartService.setCart(this.cart);
                        this.orders = this.cart.orders;
                        this.orders.forEach(o => {
                            if (o.product) {
                                this.products.push(o.product);
                                this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
                            }
                            this.totalQuantity = this.totalQuantity + o.quantity;
                        })
                      }
                    });
                  }
                });
          
              } */
        } else {
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
            });
            this.currency = 'EUR';
        }

        this.manageProducts.manageProducts$.subscribe((h : HandledProduct) => {
            this.cart = this.cartService.addAnOrder(h.product, h.quantity);
        });
    
        
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
            this.cartService.setOrders(this.orders);
        }
    }

    deleteOrder(order) {
        if (order) {
            const tempOrders : Order[] = new Array<Order>();
            this.totalQuantity = 0;
            this.totalPrice = 0;
            this.orders.forEach( o => {
                if (o.id != order.id) {
                    tempOrders.push(o);
                    this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
                    this.totalQuantity = this.totalQuantity + o.quantity;
                }
            });
            this.orders = tempOrders;
            this.cartService.setOrders(this.orders);
        }
    }

    removeSelected() {
        
    }
}