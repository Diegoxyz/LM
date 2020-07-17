import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import * as moment from 'moment';

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



  static checkDeliveryDate(control: AbstractControl) {
    const deliveryDate: string =   moment(control.get('deliverydate').value).format('YYYY-MM-DD');
    const sysDate : string =  moment().format('YYYY-MM-DD');


    if (deliveryDate <= sysDate) {
      control.get('deliverydate').setErrors({ invalidDate: true });
    }
  }

}