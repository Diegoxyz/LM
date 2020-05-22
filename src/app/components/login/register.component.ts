import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router) { }

  public registrationForm : FormGroup;

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: [null, Validators.compose([
        Validators.email,
        Validators.required])
      ],
      password1: [null, Validators.compose([Validators.required])],
      password2: [null, Validators.compose([Validators.required])],
    },
    
    {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator
    }
    );
  }

  get username() {
    return this.registrationForm.get('username');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password1() {
    return this.registrationForm.get('password1');
  }

  get password2() {
    return this.registrationForm.get('password2');
  }

  onSubmit(): void {
    this.router.navigate(['/home']);
  }
  

  onCancel(): void {
    /* this.registrationForm.reset(); */
    this.router.navigate(['/home']);
  }
}
