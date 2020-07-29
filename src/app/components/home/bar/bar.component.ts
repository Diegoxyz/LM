import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { environment } from '@environments/environment';
import { CarrelloService } from '@app/services/carrello.service';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { Carrello } from '@app/models/carrello';
import { UserDataSet } from '@app/models/OData/UserDataSet/userdataset.entity';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit, OnDestroy {

  customer: Customer;
  cart : Cart;
  bsModalRef: BsModalRef;
  faShoppingCart = faShoppingCart;
  orders : Order[] = [];

  qty : number = 0;
  private cartSubscription : Subscription;
  
  private searchPage : number = 0;

  constructor(private accountService : AccountService, private manageProducts : ManageProducts, 
    private cartService : CartService, private modalService: BsModalService,private router: Router, private changePage: ChangePage,
    private carrelloService: CarrelloService, private userDataSetService : UserDataSetService) { }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {

    if (!this.accountService.isSessionStillValid()) {
      this.accountService.logout();
      setTimeout(
        () => this.router.navigate(['/account/login', {sessionEnded : 'sessionEnded'}]),
        100
      );
    }
    if (environment && environment.oData && this.accountService.user !== undefined && this.accountService.user !== null) {
      this.carrelloService.getCart().subscribe(resp => {
        console.log('this.carrelloService.getCart -' + resp);
        if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
          this.cart = Cart.fromCarrello(resp.body.d.results, this.userDataSetService.userDataSetValue);
          this.cartService.setCart(this.cart);
        }
      });
      
      if (this.accountService.isSessionStillValid()) {
        console.log('loadCart:' + this.cartService.loadCart());
        this.cartService.cart$.subscribe((o : Order) => {
          if (this.accountService.isSessionStillValid()) {
            this.cartSubscription = this.carrelloService.getCart().subscribe(resp => {
              console.log('this.carrelloService.getCart2 -' + resp);
              if (resp.headers) {
                const sapMessage = resp.headers.get('sap-message');
                if (sapMessage !== undefined && sapMessage !== null) {
                  console.log('session invalida return');
                  return;
                }
              }
              if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                this.cart = Cart.fromCarrello(resp.body.d.results, this.userDataSetService.userDataSetValue);
                this.cartService.setCart(this.cart);
              }
            });
          } else {
            if (this.cartSubscription) {
              this.cartSubscription.unsubscribe();
            }
          }
        });
  
      }
      
        
    } else if (environment && !environment.oData) {
      const user : User = this.accountService.userValue;
      const customer : Customer = {
        firstName : user.username,
        lastName : user.username,
        fiscalCode : user.username,
      };
      this.customer = customer;
      // this.cart = this.cartService.loadMockCart(customer);
      const carrello : Carrello[] = [];
      const userDataSet : UserDataSet = { 
            'Langu': 'I',
            'KunnrRif': '',
            "Kunnr": "100021",
            'Kunnrx': 'Test',
            'KunnrRifx': '',
            'Parnr': '0000000530',
            "Email": "roberto.mazzocato@eservices.it",
            "ErdatAct": "\/Date(1590969600000)\/",
            "UzeitAct": "PT11H12M00S",
            "PswInitial": "",
            "Scenario": "2",
            "Ruolo": "",
            "ErdatChangePsw": "\/Date(1590969600000)\/",
            "UzeitChangePsw": "PT12H00M00S",
            "Token": "000D3A2544DE1EDAADBEA94A0044C28D",
            "Stras": "via tal dei tali",
            "Pstlz": "30100",
            "Ort01": "Venezia",
            "Regio": "VE",
            "Land1": "IT"
      };

      this.cart = Cart.fromCarrello(carrello, userDataSet);
            console.log('bar.component2 - this.cart.orders:' + this.cart.orders);
            this.cartService.setCart(this.cart);

      this.cartService.cart$.subscribe((o : Order) => {
        this.cart = this.cartService.getCart(this.customer);
      });
    }

    this.manageProducts.manageProducts$.subscribe((h : HandledProduct) => {
        this.cart = this.cartService.addAnOrder(h.product, h.quantity);
    });

  }

  public get cartQuantity() : number {
    // console.log('get cartQuantity:' + this.cart + ',' + (this.cart ? this.cart.orders : 'no cart') + ',' + (this.cart && this.cart.orders ? this.cart.orders.length : 'no orders'));
    this.cart = this.cartService.getCart();
    // console.log('get cartQuantity2:' + this.cart + ',' + (this.cart ? this.cart.orders : 'no cart') + ',' + (this.cart && this.cart.orders ? this.cart.orders.length : 'no orders'));
    if (this.cart && this.cart.orders) {
      this.orders = this.cart.orders;
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
    this.router.navigate(['./home/catalogue_last_purchases', { lastPurchases: 'true' }]);
  }

  public goCart() {
    this.changePage.goToPage(0);
    this.router.navigate(['./home/cart']);
  }

  public onSearch(value : string) {
    console.log('onSearch:' + value);
    this.changePage.goToPage(0);
    if (this.searchPage === 0) {
      this.searchPage = 1;
      this.router.navigate(['./home/catalogue_search', { searchKey: value }]);
    } else {
      this.searchPage = 0;
      this.router.navigate(['./home/catalogue', { searchKey: value }]);
    }
  }
}
