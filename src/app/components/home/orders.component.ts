import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@app/services/products.service';
import { CartService } from '@app/services/cart.service';
import { Cart } from '@app/models/cart';
import { Order } from '@app/models/order';
import { User } from '@app/models/user';
import { Customer } from '@app/models/customer';
import { AccountService } from '@app/services/account.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
  })
  export class OrdersComponent implements OnInit {

    cart : Cart;

    items : Order[] =[];
    
    totalQuantity : number = 0;

    config = {
      itemsPerPage: 9,
      currentPage: 1,
      totalItems: this.items.length
    };

    public maxSize: number = 9;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public responsive: boolean = true;
    public labels: any = {
        previousLabel: '<--',
        nextLabel: '-->',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };
    
    constructor(private accountService : AccountService, private cartService : CartService) { }

    ngOnInit(): void {

      const user : User = this.accountService.userValue;
      const customer : Customer = {
        firstName : user.username,
        lastName : user.username,
        fiscalCode : user.username,
      };
      
      // it must be loaded from BE
      this.cart = this.cartService.getCart();
      if (this.cart === undefined || this.cart === null ) {
        const orders : Order[] = [];
        this.cart = {
          customer : customer,
          orders : orders
        };
      }

      this.items = this.cart.orders;
      this.totalQuantity = this.items.length;
    }

    get page(){
      return this.config.currentPage;
    }
  
    get pageSize(){
      return this.config.itemsPerPage;
    }
  
    onPageChange(event){
      console.log(event);
      this.config.currentPage = event;
    }
  }