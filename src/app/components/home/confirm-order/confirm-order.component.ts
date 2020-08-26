import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from '@app/services/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { OrdersService } from '@app/services/orders.service';
import { environment } from '@environments/environment';
import { SaveOrder } from '@app/models/order';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { CustomValidators } from './custom-validators';
import { CartService } from '@app/services/cart.service';
import { Cart } from '@app/models/cart';
import { ManageProducts } from '../services/manage-products.service';
import { Product } from '@app/models/item';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})

export class ConfirmOrderComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService,
    private ordersService : OrdersService, private translateService : TranslateService, private cartService : CartService, 
    private manageProducts : ManageProducts, private userDataSetService : UserDataSetService) { }

  public confirmOrderForm: FormGroup;
  private recipientId : string;
  errorMessage : string;

  ngOnInit(): void {
/*     this.confirmOrderForm = new FormGroup({
      note: new FormControl(null, Validators.required),
      deliverydate: new FormControl(null, Validators.required)
    }); */

    

    this.confirmOrderForm = this.fb.group(
      {
        note:  [''],
        deliverydate:  ['', Validators.required]
    } 
    , 
    {
      // data non minore a quella odierna
      validator: CustomValidators.checkDeliveryDate
    }  
    );

    this.recipientId =this.route.snapshot.paramMap.get('recipientId');

    let  defaultdate = (moment().add(2, 'days')).format('YYYY-MM-DD');
    this.deliverydate.setValue( defaultdate);

  
  }

  get note() { return this.confirmOrderForm.get('note') };

  get deliverydate() { return this.confirmOrderForm.get('deliverydate') };

  onSubmit(): void {
    if (!this.confirmOrderForm.valid) {
      return;
    }


    const order = new SaveOrder();
    order.Note = this.note.value;
    order.Kunwe = this.recipientId;
    order.Vdatu = this.deliverydate.value + 'T00:00:00';
    if (environment && environment.oData) {
      this.accountService.fetchToken().subscribe(
        response1 => {
          if (response1.headers) {
            const csrftoken : string = response1.headers.get('X-CSRF-Token');
            if (csrftoken) {
              this.ordersService.saveOrder(csrftoken,order).subscribe(resp => {
                if (resp.headers) {
                  const sapMessage = resp.headers.get('sap-message');
                  console.log('confirm-order : sapMessage:' + sapMessage);
                  if (sapMessage !== undefined && sapMessage !== null) {
                    this.errorMessage = this.translateService.instant('unknownError');
                    try {
                    let sm = JSON.parse(sapMessage);
                    this.errorMessage = sm.message;
                    } catch (error) {
                    const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
                    if (docSapMessage.hasChildNodes()) {
                        if (docSapMessage.firstChild.childNodes.length >= 2) {
                        this.errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
                        }
                    }
                    }
                }
                }
                console.log('errorMessage:' + this.errorMessage);
                let orderNumber: string = '';
                if (resp.body && resp.body.d && resp.body.d.Vbeln) {
                  orderNumber = resp.body.d.Vbeln;
                }
                let successfullySent = undefined;
                if ((this.errorMessage === undefined || this.errorMessage === null) && (orderNumber !== undefined && orderNumber !== null && orderNumber !== '')) {
                  console.log('emptyCart');
                  successfullySent = 'true';
                  // this.manageProducts.emptyCart();
                  if (environment && environment.oData) {
                    const cart : Cart = this.cartService.getCart();
                    const orders = cart.orders;
                    console.log('confirm-order - orders:' + orders);
                    orders.forEach(order => {
                      this.manageProducts.changeProduct(order.product,0);
                    })
                  }
                  const product : Product = new Product('testchange','testchange',0,'',false,'','','','',0);
                  this.manageProducts.changeProduct(product,0);
                  this.cartService.emptyCart();
                  const cart : Cart = this.cartService.getCart();
                  cart.orders = [];
                  // this.cartService.setOrders(cart.orders);
                  this.cartService.setCart(cart);
                }
                
                
                this.router.navigate(['home/cart/save-order', { orderNumber: resp.body.d.Vbeln, notes: this.errorMessage, successfullySent: successfullySent }]);
              })
            }
          }
        }
      );
      
    } else {
      console.log('emptyCart');
      this.errorMessage = this.translateService.instant('registrationRequestSeccessfullySent');
      this.cartService.emptyCart();
      this.router.navigate(['home/cart/save-order']);
     }
    
   } 

  onCancel(): void {
    this.router.navigate(['home/cart/ship-to-set']);
  }
}

