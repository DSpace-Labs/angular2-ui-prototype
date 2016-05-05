import { ControlGroup } from 'angular2/common';

import { FormCreate } from '../interfaces/form-create.interface';

import { FormInput } from '../models/form-input.model';

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
    	return new Array<any>();
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
