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



  static registerPasswordMatchValidator(control: AbstractControl) {
    const password1: string = control.get('password1').value; // get password from our password form control
    const password2: string = control.get('password2').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password1 !== password2) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('password2').setErrors({ NoPassswordMatch: true });
    }
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get first password from our password form control
    const password1: string = control.get('password1').value; // get password from our password form control
    const password2: string = control.get('password2').value; // get password from our confirmPassword form control
    const passwordMinLength = 8;
    
    // Password too short
    if (password.length > 0 &&  password.length < passwordMinLength) {
      control.get('password').setErrors({ InvalidPasswordLen: true });
    }
    
    if (password1.length > 0 && password1.length < passwordMinLength) {
        control.get('password1').setErrors({ InvalidPasswordLen: true });
    }

    // First and new password can't be the same
    if (password.length > 0 && password1.length  > 0 && password === password1 ) {
      // Password can't be the same
      control.get('password1').setErrors({ PassswordMatch: true });
    }

    // compare if  password matches
    if (password1 !== password2) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('password2').setErrors({ NoPassswordMatch: true });
    }
  }
}