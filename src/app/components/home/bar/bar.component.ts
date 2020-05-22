import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Customer } from '@app/models/customer';
import { Cart } from '@app/models/cart';
import { User } from '@app/models/user';
import { ManageProducts } from '../services/manage-products.service';
import { HandledProduct } from '../services/handled-product';
import { CartService } from '@app/services/cart.service';
import { MyAccountComponent } from '../my-account/my-account.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ChangePage } from '../services/change-page.service';
import { Order } from '@app/models/order';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  customer: Customer;
  cart : Cart;
  bsModalRef: BsModalRef;
  faShoppingCart = faShoppingCart;
  
  constructor(private accountService : AccountService, private manageProducts : ManageProducts, 
    private cartService : CartService, private modalService: BsModalService,private router: Router, private changePage: ChangePage) { }

  ngOnInit(): void {
    
    const user : User = this.accountService.userValue;
    const customer : Customer = {
      firstName : user.username,
      lastName : user.username,
      fiscalCode : user.username,
    };
    this.customer = customer;

    //TODO Add existing cart from BE
    this.cart = this.cartService.loadMockCart(customer);

    this.manageProducts.manageProducts$.subscribe((h : HandledProduct) => {
        this.cart = this.cartService.addAnOrder(h.product, h.quantity);
    });

    this.cartService.cart$.subscribe((o : Order) => {
      this.cart = this.cartService.getCart(this.customer);
    });
  }

  public get cartQuantity() : number {
    if (this.cart && this.cart.orders) {
      return this.cart.orders.length;
    }
    return 0;
  }

  public openMyAccount() {
    this.bsModalRef = this.modalService.show(MyAccountComponent, { ignoreBackdropClick: true });
  }

  public goHome() {
    this.changePage.goToPage(0);
    this.router.navigate(['./home']);
  }

  public goWishlist() {
    this.changePage.goToPage(0);
    this.router.navigate(['./wishlist']);
  }

  public goCart() {
    this.changePage.goToPage(0);
    this.router.navigate(['./home/cart']);
  }

}
