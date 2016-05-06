import { Component } from 'angular2/core';
import { Router } from 'angular2/router';

import {
    FORM_DIRECTIVES,
    FORM_BINDINGS,
    ControlGroup,
    Control,
    FormBuilder,
    NgForm,
    Validators
} from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../services/authorization.service';
import { BreadcrumbService } from '../../../navigation/services/breadcrumb.service';
import { FormService } from '../../../utilities/form/form.service';

import { FormComponent } from '../../../utilities/form/form.component';
import { FormFieldsetComponent } from '../../../utilities/form/form-fieldset.component';

import { Breadcrumb } from '../../../navigation/models/breadcrumb.model';

/**
 * Login form component.
 */
@Component({
    selector: 'login',
    pipes: [ TranslatePipe ],
    directives: [ FormFieldsetComponent ],
    template: `
                <form *ngIf="active" [ngFormModel]="form" (ngSubmit)="login()" novalidate>
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <span *ngIf="unauthorized" class="validaiton-helper text-danger">
                        {{ 'login.unauthorized' | translate }}
                    </span>
                    <div class="form-loader">
                        <img *ngIf="processing" src="./static/images/loading.gif" alt="Loading">
                    </div>
                    <span class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="cancel()">{{ 'login.cancel' | translate }}</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!form.valid && processing">{{ 'login.confirm' | translate }}</button>
                    </span>
                </form>
              `
})
export class LoginComponent extends FormComponent {

    private breadcrumb: Breadcrumb = new Breadcrumb('login', true);

    /**
     * Email used as DSpace username for login.
     */
    private email: string;

    /**
     * Password used for DSpace authentication.
     */
    private password: string;

    /**
     * Boolean representing whether the login request was unauthorized. Displays message if true.
     */
    private unauthorized: boolean;

    /**
     *
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param translate
     *      TranslateService
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private breadcrumbService: BreadcrumbService,
                private formService: FormService,
                private translate: TranslateService,
                private builder: FormBuilder,
                private authorization: AuthorizationService,
                private router: Router) {
        super();
        breadcrumbService.visit(this.breadcrumb);
        translate.setDefaultLang('en');
        translate.use('en');
        this.init();
    }

    /**
     * Initialize the form and validators.
     */
    init(): void {
        this.email = '';
        this.password = '';
        this.unauthorized = false;
        this.formService.getForm('login').subscribe(inputs => {
            this.inputs = inputs;
            let formControls = {};
            for(let input of this.inputs) {
                input.value = input.default ? input.default : '';
                let validators = this.createValidators(input);
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
     * Get token and then call status to get fullname.
     */
    login(): void {
        this.processing = true;
        this.setModelValues();
        this.authorization.login(this.email, this.password).subscribe(response => {
            if(response.status == 200) {
                let token = response.text();
                this.authorization.status(token).subscribe(response => {
                    this.router.navigate(['/Home']);
                },
                error => {
                    this.processing = false;
                    this.unauthorized = true;
                });
            }
        },
        error => {
            this.processing = false;
            this.unauthorized = true;
        });
    }

    /**
     * Action for when cancel button is pressed.
     */
    cancel(): void {
        this.reset();
    }

    /**
     * Resets the form.
     */
    reset(): void {
        this.processing = false;
        this.active = false;
        this.init();
    }

}
