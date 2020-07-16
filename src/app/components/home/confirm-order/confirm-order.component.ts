import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from '@app/services/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { OrdersService } from '@app/services/orders.service';
import { environment } from '@environments/environment';
import { SaveOrder } from '@app/models/order';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})

export class ConfirmOrderComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService,
    private ordersService : OrdersService, private translateService : TranslateService) { }

  public confirmOrderForm: FormGroup;
  private recipientId : string;
  errorMessage : string;

  ngOnInit(): void {
    this.confirmOrderForm = new FormGroup({
      note: new FormControl(null, Validators.required)
    });

    this.recipientId =this.route.snapshot.paramMap.get('recipientId');

  }

  get note() { return this.confirmOrderForm.get('note') };

  onSubmit(): void {
    const order = new SaveOrder();
    order.Note = this.note.value;
    order.Kunwe = this.recipientId;

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
                    const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
                      this.errorMessage = this.translateService.instant('unknownError');
                      if (docSapMessage.hasChildNodes()) {
                        if (docSapMessage.firstChild.childNodes.length >= 2) {
                          this.errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
                        }
                      }
                  }
                }
                console.log('errorMessage:' + this.errorMessage);
                if (this.errorMessage === undefined) {
                  this.router.navigate(['home/cart/save-order']);
                }
              })
            }
          }
        }
      );
      
    } else {
      this.router.navigate(['home/cart/save-order']);
     }
    
   } 

  onCancel(): void {
    this.router.navigate(['home/cart/ship-to-set']);
  }
}

