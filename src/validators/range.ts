import { FormControl } from '@angular/forms';

export class RangeValidator {

    static isValid(control: FormControl): any {
        if (control.value > 0  && control.value <= 500){ return null; }       
            return {"The range is invalid" : true};
        }
}