import { FormControl } from '@angular/forms';

export class AgeValidator {

    static isValid(control: FormControl): any {
        if (control.value >= 18){ return null; }
            return {"You are not old enough" : true};
        }
}