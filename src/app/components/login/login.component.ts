import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginError = false;
  returnUrl: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService) { }

  public loginForm: FormGroup;

  ngOnInit(): void {
    if (this.accountService.userValue) {
      this.router.navigate(['/home']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
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
      console.log(this.email.value + '-' + this.password.value);
      this.accountService.login(this.email.value,this.password.value).pipe(first()).subscribe(
        data => {
          if (data === null) {
            this.loginError = true;
          }
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loginError = true;
        }
      );
      // this.router.navigate(['/home']);
      // redirect to home if already logged in
      
    }
  }

}
