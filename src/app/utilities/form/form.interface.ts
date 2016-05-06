import { ControlGroup } from 'angular2/common';

import { FormInput } from './form-input.model';

/**
 *
 */
export interface Form {

    /**
     * Used to remove and add the form to reset validations. Suggested by Angular2 form examples.
     */
    active: boolean;

    /**
     * Item input fields.
     */
    inputs: Array<FormInput>;

    /**
     * The forms control group.
     */
    form: ControlGroup;

    /**
     * Indicates processing in progress.
     */
    processing: boolean;
    
    /**
     *
     */
    init(): void;

    /**
     *
     */
    createValidators(input: FormInput): Array<any>;

    /**
     *
     */
    setModelValues(): void;

    /**
     *
     */
    reset(): void;

}