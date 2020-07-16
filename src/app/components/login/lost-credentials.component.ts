import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-lost-credentials',
  templateUrl: './lost-credentials.component.html',
  styleUrls: ['./lost-credentials.component.css']
})
export class LostCredentialsComponent implements OnInit {
  
  public loginForm: FormGroup;
  errorMessage : string;
  loginError : boolean = false;
  response2 : any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,private router: Router, 
    private accountService: AccountService, private translateService : TranslateService
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.email, Validators.required])]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    if (environment && environment.oData) {
      this.accountService.fetchToken().subscribe(
        response1 => {
          console.log('step 1');
          if (response1.headers) {
            console.log('X-CSRF-Token:' + response1.headers.get('X-CSRF-Token'));
            const csrftoken : string = response1.headers.get('X-CSRF-Token');
            if (csrftoken) {
              this.accountService.lostCredentials(csrftoken, this.email.value).subscribe(response2 => {
                console.log('response2:' + response2);
                this.response2 = response2;

                if (response2 && response2.error && response2.error.message) {
                  this.errorMessage = response2.error.message;
                  this.loginError = true;
                }

                if (this.errorMessage === undefined) {
                  this.loginError = true;
                  this.errorMessage = this.translateService.instant('registrationRequestSeccessfullySent');
                }
              }, error => {
                if (error) {
                  this.loginError = true;
                  this.errorMessage = this.translateService.instant('registrationRequestSeccessfullySent');
                }
              });
            }
          }
        });
      }
  }
}
