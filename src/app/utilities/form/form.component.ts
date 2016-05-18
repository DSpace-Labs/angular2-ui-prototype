import { ControlGroup, Validators } from '@angular/common';
import { Router } from '@angular/router-deprecated';

import { FormBuilder } from '@angular/common';

import { AuthorizationService } from '../../dspace/authorization/services/authorization.service';
import { FormService } from './form.service';

import { Form } from './form.interface';

import { FormInput } from './form-input.model';

/**
 *
 */
export class FormComponent implements Form {
    
    /**
     *
     */
    formService: FormService;
    
    /**
     *
     */
    builder: FormBuilder;
    
    /**
     *
     */
    authorization: AuthorizationService;
    
    /**
     *
     */
    router: Router;

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
     * Indicates processing in progress.
     */
    processing: boolean = false;
    
    /**
     *
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(formService: FormService,
                builder: FormBuilder,
                authorization: AuthorizationService,
                router: Router) {
        this.formService = formService;
        this.builder = builder;
        this.authorization = authorization;
        this.router = router;
    }

    /**
     *
     */
    init(): void {}

    /**
     *
     */
    setModelValues(): void {}

    /**
     * Reset the form.
     */
    reset(): void {
        this.processing = false;
        this.active = false;
        this.init();
    }
    
    /**
     * 
     */
    disabled(): boolean {
        return !this.form.valid || this.processing;
    }

    /**
     *
     */
    showForm(): boolean {
        return this.active && !this.processing;
    }

    /**
     *
     */
    processingMessage(): string {
        return '';
    }

    /**
     *
     */
    finish(name: string, currentContext: any): void {}
    
}
