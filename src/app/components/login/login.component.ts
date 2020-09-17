import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/models/user';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginError : boolean = false;
  sessionEndedError : boolean = false;
  returnUrl: string;
  errorMessage : string;
  public language : string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, 
    private userDataSetService : UserDataSetService, private translateService : TranslateService,
    private spinner: NgxSpinnerService) { }

  public loginForm: FormGroup;

  ngOnInit(): void {
    if (this.accountService.userValue) {
      this.router.navigate(['/home']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/boards';
    const error = this.route.snapshot.paramMap.get('sessionEnded');
    if (error) {
      // this.errorMessage = this.translateService.instant('sessionEnded');
      this.sessionEndedError = true;
    }

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.language = this.accountService.getLanguage();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loginError = false;
    this.errorMessage = undefined;
    this.sessionEndedError = false;
    if (this.email && this.password) {
      if (environment && environment.oData) {
        this.spinner.show();
        this.accountService.fetchToken().subscribe(
          response1 => {
            console.log('step 1');
            if (response1.headers) {
              console.log('X-CSRF-Token:' + response1.headers.get('X-CSRF-Token'));
              const csrftoken : string = response1.headers.get('X-CSRF-Token');
              const u : User = new User();
              if (csrftoken) {
                this.accountService.postLogin(csrftoken, this.email.value, this.password.value).subscribe(response2 => {
                  console.log('step 2');
                  const sapMessage = response2.headers.get('sap-message');
                  if (sapMessage !== undefined && sapMessage !== null) {
                    this.loginError = true;
                    console.log('found error message:' + sapMessage);
                    // C'è stato un errore e.g. password non valida
                    u.username = '';
                    u.password = '';
                    u.token = '';
                    u.lang = '';
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
                  } else 
                  if (response2.body && response2.body.d && response2.body.d.Token) {
                    console.log('found token:' + response2.body.d.Token);
                    u.username = this.email.value;
                    u.password = this.password.value;
                    u.token = response2.body.d.Token;
                    u.lang = response2.body.d.Langu;
                    this.accountService.setUserValue(u.username,u.password, u.token, u.lang);
                    this.loginError = false;
                    this.returnUrl = '/home';
                    this.userDataSetService.fetchUserDatSet(u.username, u.token, this.accountService.getLanguage()).subscribe(resp => {
                      if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                        console.log('resp.body.d.results[0].PswInitial:' + resp.body.d.results[0].PswInitial);
                        if (resp.body.d.results[0].PswInitial !== undefined && resp.body.d.results[0].PswInitial !== '') {
                          console.log('pswinitial');
                          this.returnUrl = '/account/changePwd';
                        } 
                        this.userDataSetService.setUserSetValue(resp);
                      }
                      this.router.navigate([this.returnUrl, { email: this.email.value }]);
                    }, error => {
                      this.loginError = true;
                    });
                  }
                  
                }, () => { /*this.spinner.hide();*/ console.log('done'); }
                );
                
              } 
          }},
          error => {
            this.errorMessage = this.translateService.instant('unknownError');
            this.loginError = true;
          },
          () => {
            this.spinner.hide();
          }
        );
      } else {
         /** spinner starts on init */
        this.spinner.show();
        
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        
    
          // const sapMessage = '{"code":"ZSPB2B/000","message":"Accesso rifiutato","severity":"error","target":"","transition":false,"details":[]}';
          const sapMessage = '<notification xmlns:sap="http://www.sap.com/Protocols/SAPData"><code>ZSPB2B/000</code><message>Utente gi&#x00E0; registrato</message><severity>error</severity><target></target><transition>false</transition><details/></notification>';
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
          
          /*const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
          this.errorMessage = this.translateService.instant('unknownError');
          if (docSapMessage.hasChildNodes()) {
            if (docSapMessage.firstChild.childNodes.length >= 1) {
              this.errorMessage = docSapMessage.firstChild.childNodes[0].textContent;
            }
          }*/
          this.accountService.loginWOOData(this.email.value,this.password.value).pipe(first()).subscribe(
            data => {
              console.log("login onsubmit:" + data);
              if (data === null) {
                this.loginError = true;
              } else {
                this.loginError = false;
              }
              // this.userDataSetService.saveUserDataSet(this.email.value, this.password.value, 'IT');
              // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account/changePwd';
              // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account/changePwd';
              this.router.navigate([this.returnUrl]);
            },
            error => {
              this.loginError = true;
            }
          );
        }
      , 5000);
      // this.router.navigate(['/home']);
      // redirect to home if already logged in
      
    }
  }
}

}
