import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { UtilityService } from '@app/services/utility.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router,
    private utilityService : UtilityService) { }

  public registrationForm : FormGroup;
  
  public nations : string = '';

  public regions : string = '';

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
      validator: CustomValidators.registerPasswordMatchValidator
    }
    );

    if (environment && environment.oData) {
      this.utilityService.getNations().subscribe(resp => {
        if (resp && resp.body && resp.body.d && resp.body.d.results.length > 0) {
          resp.body.d.results.forEach(element => {
            if (this.nations !== '') {
              this.nations = this.nations.concat(',');
            }
            this.nations = this.nations.concat(element.Land1).concat('-').concat(element.Land1x);
  
            if (element.Land1 === 'IT') {
              this.utilityService.getRegions(element.Land1).subscribe(resp => {
                if (resp && resp.body && resp.body.d && resp.body.d.results.length > 0) {
                  resp.body.d.results.forEach(element => {
                    if (this.regions !== '') {
                      this.regions = this.regions.concat(',');
                    }
                    this.regions = this.regions.concat(element.Regio).concat('-').concat(element.Agrigento);
                  });
                }
              }, error => {
                console.log('error:' + error);
              });
            }
          });
        }
      }, error => {
        console.log('error:' + error);
      });
    }
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
