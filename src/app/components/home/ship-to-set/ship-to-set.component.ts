import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '@app/services/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { Country, Region } from '@app/models/country';
import { OrdersService } from '@app/services/orders.service';
import { Recipient } from '@app/models/order';

@Component({
  selector: 'app-ship-to-set',
  templateUrl: './ship-to-set.component.html',
  styleUrls: ['./ship-to-set.component.css']
})
export class ShipToSetComponent implements OnInit {


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, 
    private utilityService : UtilityService, private orderService : OrdersService) { }

  public shippingForm: FormGroup;

  countryForm: FormGroup;
  
  countries : Country[] = [];
  regions : Region[] = [];
  recipients: Recipient[] = [];
  disableRegion: boolean = true;

  recipientId : string = undefined;

  ngOnInit(): void {

   this.shippingForm = this.fb.group({
      receiver: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
      region: ['', Validators.required]
    });
 

    if (environment && environment.oData) {
      this.utilityService.getCountries().subscribe(resp => {
        if (resp && resp.body && resp.body.d && resp.body.d.results.length > 0) {
          resp.body.d.results.forEach(c => {
            this.countries.push({ 'id':c.Land1, 'name':c.Land1x});
          });
        }
      });

      this.orderService.getDestinatariMerce().subscribe(resp => {
        if (resp && resp.body && resp.body.d && resp.body.d.results.length > 0) {
          resp.body.d.results.forEach(c => {
            console.log('c:' + c);
            if (c) {
              console.log('c.Kunwe:' + c.Kunwe);
            }
            const recipient = new Recipient();
            recipient.Kunwe = c.Kunwe;
            recipient.Kunwex = c.Kunwex;
            recipient.Email = c.Email;
            recipient.Token = c.Token;
            recipient.Langu = c.Langu;
            recipient.Stras = c.Stras;
            recipient.Pstlz = c.Pstlz;
            recipient.Ort01 = c.Ort01;
            recipient.Regio = c.Regio;
            recipient.Regiox = c.Regiox;
            recipient.Land1 = c.Land1;
            recipient.Land1x = c.Land1x;

            this.recipients.push(recipient);
          });
          console.log('this.recipients.length:' + this.recipients.length);
          if (this.recipients.length > 0) {
            const firstRecipient = this.recipients[0];
            console.log('this.recipients[0]:' + firstRecipient);
            this.recipientId = firstRecipient.Kunwe;
            this.receiver.setValue(firstRecipient.Kunwex);
            this.address.setValue(firstRecipient.Stras);
            this.city.setValue(firstRecipient.Ort01);
            this.zipCode.setValue(firstRecipient.Pstlz);
            this.country.setValue(firstRecipient.Land1);
            this.region.setValue(firstRecipient.Regio);
            this.utilityService.getRegions(firstRecipient.Land1).subscribe(resp => {
              if (resp && resp.body && resp.body.d && resp.body.d.results.length > 0) {
                resp.body.d.results.forEach(r => {
                  this.regions.push({ 'id':r.Regio, 'name':r.Regiox});
                });
                this.region.setValue(firstRecipient.Regio);
              }
            });
          } else {
            this.regions = [];
          }
        }
      });
    } else {
      this.countries.push({ "id": "01", "name": "Italy"});
      this.countries.push({ "id": "02", "name": "Germany"});

      this.regions.push({'id':'01',name:'Veneto'});
      this.regions.push({'id':'02',name:'Piemonte'});
    }


  }
  

    get receiver() {
      return this.shippingForm.get('receiver');
    }
  
 
    get address() {
      return this.shippingForm.get('address');
    }
  
    get city() {
      return this.shippingForm.get('city');
    }
  
    get zipCode() {
      return this.shippingForm.get('zipCode');
    }
  
    get country() {
      return this.shippingForm.get('country');
    }

    get region() {
      return this.shippingForm.get('region');
    }
  
    changeCountry(event) {
      if (event) {
        this.regions = [];
        this.disableRegion = this.country.status === 'INVALID';
        if (!this.disableRegion) {
          console.log('this.disableregion:' + this.disableRegion);
          if (environment && environment.oData) {
            const countryCode = this.country.value;
            console.log('countryCode:' + countryCode)
            this.utilityService.getRegions(countryCode).subscribe(resp => {
              if (resp && resp.body && resp.body.d && resp.body.d.results.length > 0) {
                resp.body.d.results.forEach(r => {
                  this.regions.push({ 'id':r.Regio, 'name':r.Regiox});
                });
              }
            });
          } else {
            this.regions.push({'id':'01',name:'Veneto'});
            this.regions.push({'id':'02',name:'Piemonte'});
          }
          
        }
      }
    }

  onSubmit(): void {
    //TODO valida il form
    if (environment && !environment.oData) {
      this.recipientId = 'test';
      this.router.navigate(['/home/cart/confirm-order', { recipientId : this.recipientId }]);
    } else {
      // Casomai l'utente l'avesse modificato andiamo a salvarlo comunque
      const recipient = new Recipient();
      recipient.Kunwe = this.recipientId;
      recipient.Kunwex = this.receiver.value;
      recipient.Stras = this.address.value;
      recipient.Pstlz = this.zipCode.value;
      recipient.Ort01 = this.city.value;
      recipient.Regio = this.region.value;
      recipient.Land1 = this.country.value;

      this.accountService.fetchToken().subscribe(
        response1 => {
          if (response1.headers) {
            const csrftoken : string = response1.headers.get('X-CSRF-Token');
            if (csrftoken) {
              this.orderService.updateDestinatarioMerce(csrftoken,recipient).subscribe(resp => {
                console.log('update destinatario resp:' + resp);
                this.router.navigate(['/home/cart/confirm-order', { recipientId : this.recipientId }]);
              })
            }
          }
        }
      );
    }
    
    
  }

  onCancel(): void {
    this.router.navigate(['/home/cart']);
  }


}
