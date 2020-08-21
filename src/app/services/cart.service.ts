import { Injectable } from '@angular/core';
import { Product } from '@app/models/item';
import { Cart } from '@app/models/cart';
import { Order } from '@app/models/order';
import { AccountService } from './account.service';
import { Customer } from '@app/models/customer';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class CartService {
    private cartId : string = "lmCart";

    private _cart = new Subject();
    cart$ = this._cart.asObservable();

    public addAnOrder(product : Product, quantity : number) : Cart {
        // simple way, we just add a product as soon as we receive it
        let cart : Cart = this.getCart();
        console.log('addAnOrder-product:' +product + '-quantity:' + quantity + '-cart:' + cart);
        
        if (product && cart != undefined && cart != null) {
          const tempOrders : Order[] = [];
          const order : Order = {
            id: product.code,
            product : product,
            quantity : quantity
          }
          let index : number = -1;
          let found : boolean = false;
          console.log('addAnOrder - product.code:' + product.code);
          cart.orders.forEach(o => {
            index = index + 1;
            console.log('addAnOrder - comparing with code:' + o.product.code);
            if (o && o.product && o.product.code === product.code) {
              console.log('addAnOrder-code:' +product.code + '-found');
              found = true;
            } else {
              tempOrders.push(order);
            }
          })
          if (found && index > -1) {
            console.log('set order adding quantity:' + quantity + ' to ' + order.quantity);
            order.quantity = quantity;
            console.log('set order quantity to:' + order.quantity);
          }
          if (order.quantity > 0) {
            tempOrders.push(order);
          }
          cart.orders = tempOrders;
        }
        localStorage.setItem(this.cartId, JSON.stringify(cart));
        this._cart.next();
        return cart;
      }

      public getCart(customer? : Customer) : Cart {
        let cart : Cart = null;
        cart = JSON.parse(localStorage.getItem(this.cartId));
        
        if (cart === undefined || cart === null) {
          const orders : Order[] = [];
          cart = {
            customer : customer,
            orders : orders
          };
          localStorage.setItem(this.cartId, JSON.stringify(cart));
        }
        return cart;
      }

      public isCartEmpty() : boolean {
        return this.getCart().orders.length === 0;
      }
      
      public emptyCart() {
        console.log('emptyCart');
        localStorage.removeItem(this.cartId);
        this._cart.next(null);
      }

      public loadMockCart(customer? : Customer) : Cart {
        let cart : Cart = null;
        const orders : Order[] = [];
        const items : Product[] = Array(20).fill(0).map((x, i) => (
          new Product(`Code ${i + 1}`,`Product ${i + 1}`, (i+1 * 10), 'EUR', (i%2 === 0), 'Gerarchia', 'Gerarchia',(i%2 === 0)?'X':'','PZ')
          ));
        items.forEach(i => {
          const order : Order = new Order;
          order.product = i;
          order.quantity = 1;
          order.id = order.product.code;
          orders.push(order);
        })
        cart = {
          customer : customer,
          orders : orders
        };
        localStorage.setItem(this.cartId, JSON.stringify(cart));
        return cart;
      }

      public setOrders(orders : Order[]) {
        const cart : Cart = this.getCart();
        cart.orders = orders;
        localStorage.setItem(this.cartId, JSON.stringify(cart));
        this._cart.next();
      }

      public setCart(cart: Cart) {
        localStorage.setItem(this.cartId, JSON.stringify(cart));
      }

      public loadCart() : string {
        return localStorage.getItem(this.cartId);
      }
  }