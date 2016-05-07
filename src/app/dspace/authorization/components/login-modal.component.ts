import { Component } from 'angular2/core';

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
import { FormService } from '../../../utilities/form/form.service';

import { FormComponent } from '../../../utilities/form/form.component';
import { FormFieldsetComponent } from '../../../utilities/form/form-fieldset.component';
import { FormModalComponent, ModalAction } from '../../../utilities/form/form-modal.component';

/**
 * Login form. Uses form-modal component.
 */
@Component({
  	selector: 'login-modal',
  	directives: [ FormFieldsetComponent, FormModalComponent ],
  	pipes: [ TranslatePipe ],
  	template: `
                <form-modal *ngIf="active" 
                    [form]="form"
                    [title]="'login.title'"
                    [cancelLabel]="'login.cancel'"
                    [confirmLabel]="'login.confirm'"
                    [valid]="form.valid && !processing"
                    (loadedEmitter)="onLoaded($event)"
                    (actionEmitter)="onAction($event)">
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>
                    <span *ngIf="unauthorized" class="validaiton-helper text-danger">
                        {{ 'login.unauthorized' | translate }}
                    </span>
                </form-modal>
              `
})
export class LoginModalComponent extends FormComponent {

    /**
     * Actual FormModal used to show and hide modal.
     */
    private login: FormModalComponent;

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
    constructor(private formService: FormService,
                private translate: TranslateService,
                private builder: FormBuilder,
                private authorization: AuthorizationService) {
        super();
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
     * Callback to assign modal after being loaded.
     *
     * @param modal
     *      FormModal
     */
    onLoaded(modal: FormModalComponent): void {
        this.login = modal;
    }

    /**
     * Callback to invoke chosen action.
     *
     * @param action
     *      ModalAction of chosen action, CONFIRM or CANCEL
     */
    onAction(action: ModalAction): void {
        if(action == ModalAction.CONFIRM) {
            this.processing = true;
            this.setModelValues();
            this.authorization.login(this.email, this.password).subscribe(response => {
                if(response.status == 200) {
                    let token = response.text();

                    this.authorization.status(token).subscribe(response => {
                        this.login.hide();
                        this.login.finished();
                        this.reset();
                    },
                    error => {
                        this.processing = false;
                        this.unauthorized = true;
                        this.login.finished();
                    });
                }
            },
            error => {
                this.processing = false;
                this.unauthorized = true;
                this.login.finished();
            });
        }
        else if(action == ModalAction.CANCEL) {
            this.reset();
        }
    }

    /**
     * Opens the modal.
     */
    private openLoginModal(): void {
        this.login.show();
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