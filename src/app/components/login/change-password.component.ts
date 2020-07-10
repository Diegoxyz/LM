import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User, UserData } from '@app/models/user';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { CustomValidators } from './custom-validators';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  loginError : boolean = undefined;
  returnUrl: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, 
    private userDataSetService : UserDataSetService) { }

  public changePasswordForm: FormGroup;

  ngOnInit(): void {
  
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/boards';
    this.changePasswordForm = this.fb.group(
      {
      password:  ['', Validators.required],
      password1:  ['', Validators.required],
      password2:  ['', Validators.required],
    }
    , 
    {
      // check if previos and new password are not the same 
        // and new  password and confirm password do not match
      validator: CustomValidators.passwordMatchValidator
    }  
    );
  }

  get password() {
    console.log(this.changePasswordForm.get('password'))
    return this.changePasswordForm.get('password');
  }

  get password1() {
    return this.changePasswordForm.get('password1');
  }

  get password2() {
    return this.changePasswordForm.get('password2');
  }

  onSubmit(): void {
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    // save the new password and route to the home page
    
    if (this.password && this.password1) {
      if (environment && environment.oData) {

        this.accountService.fetchToken().subscribe(
          response1 => {
            this.loginError = true;
            console.log('step 1');
            if (response1.headers) {
              console.log('X-CSRF-Token:' + response1.headers.get('X-CSRF-Token'));
              const csrftoken : string = response1.headers.get('X-CSRF-Token');
              const u : User = this.accountService.userValue;
              const uData : UserData = new UserData();
              if (csrftoken) {
                this.accountService.changePassword(u.username, this.password.value, this.password1.value, u.token,u.lang, csrftoken).subscribe(
                  response2 => {
                    console.log('change password - no error');

                    this.loginError = false;
                    this.router.navigate([this.returnUrl]);
                }, error => {
                  this.loginError = true;
                }
                );
                
              } 
          }},
          error => {
            this.loginError = true;
          }
        );
      } else {
        this.router.navigate([this.returnUrl]);
      }
      
      // this.router.navigate(['/home']);
      // redirect to home if already logged in
      
    }
  }


}
