import { ControlGroup, Validators } from 'angular2/common';

import { FormCreate } from './form-create.interface';

import { FormInput } from './form-input.model';

/**
 *
 */
export class AbstractCreateComponent implements FormCreate {

    /**
     * Used to remove and add the form to reset validations. Suggested by Angular2 form examples.
     */
    active: boolean = false;

    /**
     * Item input fields.
     */
    inputs: Array<FormInput>;

    /**
     * The forms control group.
     */
    form: ControlGroup;

    /**
     * Indicates item creation in progress.
     */
    creating: boolean = false;

    /**
     *
     */
    init(): void {};

    /**
     *
     */
    createValidators(input: FormInput): Array<any> {
        let validators: Array<any> = new Array<any>();
        for(let key in input.validation) {
            if(key == 'required') {
                if(input.validation[key]) {
                    validators.push(Validators.required);
                }
            }
            else {
                validators.push(Validators[key](input.validation[key].value));
            }
        }
        return validators;
    };

    /**
     *
     */
    setModelValues(): void {}

    /**
     * Reset the form.
     */
    reset(): void {
        this.creating = false;
        this.active = false;
        this.init();
    }

}
