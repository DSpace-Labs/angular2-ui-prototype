import { Component } from 'angular2/core';
import { Router } from 'angular2/router';
import { Control, FormBuilder, Validators } from 'angular2/common';

import { AuthorizationService } from '../services/authorization.service';
import { FormService } from '../../../utilities/form/form.service';

import { FormComponent } from '../../../utilities/form/form.component';
import { FormFieldsetComponent } from '../../../utilities/form/form-fieldset.component';

/**
 * 
 */
export class LoginComponent extends FormComponent {

    /**
     * Email used as DSpace username for login.
     */
    email: string;

    /**
     * Password used for DSpace authentication.
     */
    password: string;

    /**
     * Boolean representing whether the login request was unauthorized. Displays message if true.
     */
    unauthorized: boolean;

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
        super(formService, builder, authorization, router);
    }

    /**
     * Initialize the form and validators.
     */
    init(): void {
        this.email = undefined;
        this.password = undefined;
        this.unauthorized = false;
        this.formService.getForm('login').subscribe(inputs => {
            this.inputs = inputs;
            let formControls = {};
            for(let input of this.inputs) {
                input.value = input.default ? input.default : '';
                let validators = this.formService.createValidators(input);
                formControls[input.id] = new Control('', Validators.compose(validators));
            }
            this.form = this.builder.group(formControls);
            this.active = true;
        },
        errors => {
            console.log(errors);
        });
    }
    
    /**
     *
     */
    setModelValues(): void {
        for(let input of this.inputs) {
            if(input.key == 'email') {
                this.email = input.value;
            }
            if(input.key == 'password') {
                this.password = input.value;
            }
        }
    }

    /**
     * Action for when cancel button is pressed.
     */
    cancel(): void {
        this.reset();
    }

}
