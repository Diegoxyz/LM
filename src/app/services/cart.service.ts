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
        if (product && quantity > 0 && cart != undefined && cart != null) {
          const order : Order = {
            id: product.code,
            product : product,
            quantity : quantity
          }
          let index : number = -1;
          let found : boolean = false;
          cart.orders.forEach(o => {
            index = index + 1;
            if (o && o.product && o.product.code === product.code) {
              found = true;
            }
          })
          if (found && index > -1) {
            cart.orders.splice(index);
            order.quantity = order.quantity + quantity;
          }
          if (order.quantity > 0) {
            cart.orders.push(order);
          }
          
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

      public emptyCart() {
        localStorage.removeItem(this.cartId);
        this._cart.next();
      }

      public loadMockCart(customer? : Customer) : Cart {
        let cart : Cart = null;
        const orders : Order[] = [];
        const items : Product[] = Array(20).fill(0).map((x, i) => (
          new Product(`Code ${i + 1}`,`Product ${i + 1}`, (i+1 * 10), 'EUR', (i%2 === 0), 'Gerarchia',(i%2 === 0)?'X':'')
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