import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const oldPassword: string = control.get('firstPassword').value; // get first password from our password form control
    const password1: string = control.get('password1').value; // get password from our password form control
    const password2: string = control.get('password2').value; // get password from our confirmPassword form control
    const passwordMinLength = 8;
    
    // Password too short
    if (oldPassword.length != passwordMinLength) {
      control.get('firstPassword').setErrors({ NoPassswordMatch: true });
    }
    
    if (password1.length != passwordMinLength) {
        control.get('password1').setErrors({ NoPassswordMatch: true });
    }

    // First and new password can't be the same
    if (oldPassword == password1 || oldPassword == password2) {
      // Password can't be the same
      control.get('firstPassword').setErrors({ NoPassswordMatch: true });
    }

    // compare is the password math
    if (password1 !== password2) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('password2').setErrors({ NoPassswordMatch: true });
    }
  }
}