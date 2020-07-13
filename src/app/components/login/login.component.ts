import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/models/user';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { UtilityService } from '@app/services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginError : boolean = false;
  returnUrl: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, 
    private userDataSetService : UserDataSetService, private utilityService : UtilityService) { }

  public loginForm: FormGroup;

  ngOnInit(): void {
    if (this.accountService.userValue) {
      this.router.navigate(['/home']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/boards';
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
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
    if (this.email && this.password) {
      if (environment && environment.oData) {
        this.accountService.fetchToken().subscribe(
          response1 => {
            this.loginError = true;
            console.log('step 1');
            if (response1.headers) {
              console.log('X-CSRF-Token:' + response1.headers.get('X-CSRF-Token'));
              const csrftoken : string = response1.headers.get('X-CSRF-Token');
              const u : User = new User();
              if (csrftoken) {
                this.accountService.postLogin(csrftoken, this.email.value, this.password.value).subscribe(response2 => {
                  console.log('step 2');
                  if (response2.headers.get('sap-message')) {
                    console.log('found error message:' + response2.headers.get('sap-message'));
                    // C'è stato un errore e.g. password non valida
                    u.username = '';
                    u.password = '';
                    u.token = '';
                    u.lang = '';
                  }
                  if (response2.body && response2.body.d && response2.body.d.Token) {
                    console.log('found token:' + response2.body.d.Token);
                    u.username = this.email.value;
                    u.password = this.password.value;
                    u.token = response2.body.d.Token;
                    u.lang = response2.body.d.Langu;
                    this.accountService.setUserValue(u.username,u.password, u.token, u.lang);
                    this.loginError = false;

                    this.userDataSetService.fetchUserDatSet(u.username, u.token, this.accountService.getLanguage()).subscribe(resp => {
                      if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                        if (resp.body.d.results[0].PswInitial !== undefined && resp.body.d.results[0].PswInitial !== '') {
                          this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account/changePwd';
                        }
                        this.userDataSetService.setUserSetValue(resp);
                      }
                      
                      this.router.navigate([this.returnUrl]);
                    }, error => {
                      this.loginError = true;
                    });
                  }
                  
                }
                );
                
              } 
          }},
          error => {
            this.loginError = true;
          }
        );
      } else {
        this.accountService.loginWOOData(this.email.value,this.password.value).pipe(first()).subscribe(
          data => {
            console.log("login onsubmit:" + data);
            if (data === null) {
              this.loginError = true;
            } else {
              this.loginError = false;
            }
            this.userDataSetService.saveUserDataSet(this.email.value, this.password.value, 'IT');
            // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account/changePwd';
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account/changePwd';
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.loginError = true;
          }
        );
      }
      
      // this.router.navigate(['/home']);
      // redirect to home if already logged in
      
    }
  }

}
