import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    });
  }

  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
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

  get address() {
    return this.registrationForm.get('address');
  }

  get city() {
    return this.registrationForm.get('city');
  }

  get state() {
    return this.registrationForm.get('state');
  }

  get zip() {
    return this.registrationForm.get('zip');
  }

  onSubmit(): void {
    this.router.navigate(['/home']);
  }
}
