import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { environment } from '@environments/environment';
import { UserReq } from '@app/models/user';
import {TranslateService} from '@ngx-translate/core';
import { UtilityService } from '@app/services/utility.service';
import { Country, Region } from '@app/models/country';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {


  loginError : boolean = false;
  successMessage : boolean = false;
  returnUrl: string;
  errorMessage? : string;
  public language : string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, 
    private utilityService : UtilityService, private translateService : TranslateService) { }


  public registrationForm: FormGroup;

  
  countryForm: FormGroup;
  countries : Country[] = [];

  regions : Region[] = [];
  
  disableRegion: boolean = true;

  taxNumberOrVATNumberAreMandatory : boolean = false;

  ngOnInit(): void {
    if (this.accountService.userValue) {
      this.router.navigate(['/home']);
    }
    this.language = this.accountService.getLanguage();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/boards';
    
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      taxNumber: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9]*'), Validators.maxLength(16)])],
      vatNumber: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9]*'), Validators.maxLength(11)])],
      address:   ['', Validators.required],
      email:     [null, Validators.compose([Validators.email, Validators.required])],
      city:      ['', Validators.required],
      zipCode:   ['', Validators.required],
      phone:     ['', Validators.required],
      country:   ['', Validators.required],
      region:    ['', Validators.required] 
    });

     if (environment && environment.oData) {
      this.utilityService.getCountries().subscribe(resp => {
        if (resp && resp.body && resp.body.d && resp.body.d.results.length > 0) {
          resp.body.d.results.forEach(c => {
            this.countries.push({ 'id':c.Land1, 'name':c.Land1x});
          });
        }
      });

     }else{
      this.countries.push({ "id": "01", "name": "Italy"});
      this.countries.push({ "id": "02", "name": "Germany"});
     
    }

  }


  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }

  get taxNumber() {
    return this.registrationForm.get('taxNumber');
  }

  get vatNumber() {
    return this.registrationForm.get('vatNumber');
  }

  get address() {
    return this.registrationForm.get('address');
  }

  get city() {
    return this.registrationForm.get('city');
  }

  get zipCode() {
    return this.registrationForm.get('zipCode');
  }

  get phone() {
    return this.registrationForm.get('phone');
  }

  get region() {
    return this.registrationForm.get('region');
  }

  get country() {
    return this.registrationForm.get('country');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  isTaxNumberOrVATNumberRequiredAndTouched() {
    if (!this.taxNumber.touched && !this.vatNumber.touched) {
      return false;
    }
    return ((this.taxNumber.value === undefined || this.taxNumber.value === '') && (this.vatNumber.value === undefined || this.vatNumber.value === ''));
  }
  isTaxNumberOrVATNumberRequired(){
    return ((this.taxNumber.value === undefined || this.taxNumber.value === '') && (this.vatNumber.value === undefined || this.vatNumber.value === ''));
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
    this.successMessage = false;
    this.loginError = false;
    this.taxNumberOrVATNumberAreMandatory = false;
    if (this.isTaxNumberOrVATNumberRequired()) {
      this.taxNumber.markAsTouched;
      this.vatNumber.markAsTouched;
      this.taxNumberOrVATNumberAreMandatory = true;
      return;
    }
    if (!this.registrationForm.valid) {
      return;
    }
    if (environment && environment.oData) {
      this.accountService.fetchToken().subscribe(
        response1 => {
          if (response1.headers) {
            const csrftoken : string = response1.headers.get('X-CSRF-Token');
            if (csrftoken) {
              const userReq : UserReq = new UserReq();
              userReq.Email = this.email.value;
              userReq.Stcd1 = this.taxNumber.value;
              userReq.Stcd2 = this.vatNumber.value;
              userReq.Name1 = this.firstName.value;
              userReq.Name2 = this.lastName.value;
              userReq.Telf1 = this.phone.value;
              userReq.Ort01 = this.city.value;
              userReq.Pstlz = this.zipCode.value;
              userReq.Regio = this.region.value;
              userReq.Stras = this.address.value;
              userReq.Land1 = this.country.value;
              userReq.Langu = this.accountService.getBrowserLanguage().toUpperCase();
              this.accountService.registration(csrftoken,userReq).subscribe(
                resp => {
                  if (resp.headers) {
                    const sapMessage = resp.headers.get('sap-message');
                    if (sapMessage !== undefined && sapMessage !== null) {
                      let errorMessage = this.translateService.instant('unknownError');
                      try {
                          let sm = JSON.parse(sapMessage);
                          errorMessage = sm.message;
                      } catch (error) {
                          const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
                          if (docSapMessage.hasChildNodes()) {
                              if (docSapMessage.firstChild.childNodes.length >= 2) {
                                  errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
                              }
                          }
                      }
                      this.errorMessage = errorMessage;
                    }
                    console.log('errorMessage:' + this.errorMessage);
                  }
                  if (this.errorMessage === undefined) {
                    this.successMessage = true;
                  } else {
                    this.loginError = true;
                  }
                    
                }
              );
            }
          }
        });
      
    } else {
      /*const sapMessage = '<notification xmlns:sap="http://www.sap.com/Protocols/SAPData"><code>ZSPB2B/000</code><message>Utente gi&#x00E0; registrato</message><severity>error</severity><target></target><transition>false</transition><details/></notification>';
      const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
      this.errorMessage = this.translateService.instant('registrationRequestSeccessfullySent');
      if (docSapMessage.hasChildNodes()) {
        if (docSapMessage.firstChild.childNodes.length >= 2) {
          this.errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
          this.loginError = true;
        }
      }*/
      this.successMessage = true;
    }
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }

}
