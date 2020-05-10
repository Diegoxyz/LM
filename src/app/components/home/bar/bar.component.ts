import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Customer } from '@app/models/customer';
import { Cart } from '@app/models/cart';
import { User } from '@app/models/user';
import { Product } from '@app/models/item';
import { Order } from '@app/models/order';
import { ManageProducts } from '../services/manage-products.service';
import { HandledProduct } from '../services/handled-product';
import { CartService } from '@app/services/cart.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  customer: Customer;
  cart : Cart;

  constructor(private accountService : AccountService, private manageProducts : ManageProducts, 
    private cartService : CartService) { }

  ngOnInit(): void {
    
    const user : User = this.accountService.userValue;
    const customer : Customer = {
      firstName : user.username,
      lastName : user.username,
      fiscalCode : user.username,
    };
    this.customer = customer;

    //TODO Add existing cart from BE
    this.cart = this.cartService.getCart(customer);

    this.manageProducts.manageProducts$.subscribe((h : HandledProduct) => {
        this.cart = this.cartService.addAnOrder(h.product, h.quantity);
    })
  }

  public logout() {
    this.accountService.logout();
  }

  public get cartQuantity() : number {
    if (this.cart && this.cart.orders) {
      return this.cart.orders.length;
    }
    return 0;
  }

}
