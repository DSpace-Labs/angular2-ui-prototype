import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../services/authorization.service';

import {FormModal, ModalAction} from '../../../utilities/components/form-modal.component';

/**
 * Login form. Uses form-modal component.
 */
@Component({
  	selector: 'login-form',
  	directives: [FormModal],
  	pipes: [TranslatePipe],
  	template: `
                <form-modal 
                    id="login"
                    [title]="'login.title'"
                    [cancel-label]="'login.cancel'"
                    [confirm-label]="'login.confirm'"
                    [valid]="loginEmail.valid && loginPassword.valid"
                    (loaded)="onLoaded($event)"
                    (action)="onAction($event)">

                    <fieldset class="form-group" [class.has-error]="!loginEmail.valid && !loginEmail.pristine">
                        <label for="login-email">{{'login.email-gloss' | translate}}</label>
                        <input type="email" 
                               id="login-email" 
                               placeholder="{{'login.email-placeholder' | translate}}" 
                               [(ngModel)]="email"
                               #loginEmail="ngForm"
                               class="form-control"
                               pattern="\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\w+)*(\\.\\w{2,3})+"
                               required>

                        <span [hidden]="loginEmail.valid || loginEmail.pristine" class="validaiton-helper">
                            <span *ngIf="loginEmail.errors && loginEmail.errors.pattern">
                                {{'login.email-invalid' | translate}}
                            </span>
                            <span *ngIf="loginEmail.errors && loginEmail.errors.required">
                                {{'login.email-required' | translate}}
                            </span>
                        </span>
                    </fieldset>

                    <fieldset class="form-group" [class.has-error]="!loginPassword.valid && !loginPassword.pristine">
                        <label for="login-password">{{'login.password-gloss' | translate}}</label>
                        <input type="password" 
                               id="login-password" 
                               placeholder="{{'login.password-placeholder' | translate}}" 
                               [(ngModel)]="password"
                               #loginPassword="ngForm"
                               class="form-control"
                               minlength="6"
                               required>

                        <span [hidden]="loginPassword.valid || loginPassword.pristine" class="validaiton-helper">
                            <span *ngIf="loginPassword.errors && loginPassword.errors.minlength">
                                {{'login.password-minlength' | translate}}
                            </span>
                            <span *ngIf="loginPassword.errors && loginPassword.errors.required">
                                {{'login.password-required' | translate}}
                            </span>
                        </span>
                    </fieldset>

                    <span *ngIf="unauthorized" class="validaiton-helper text-danger">
                        {{'login.unauthorized' | translate}}
                    </span>

                </form-modal>
              `
})
export class LoginFormComponent {

    /**
     * Actual FormModal used to show and hide modal.
     */
    private login: FormModal;

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
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param translate 
     *      TranslateService
     */
    constructor(private authorization: AuthorizationService,
                private translate: TranslateService) {
        translate.setDefaultLang('en');
        translate.use('en');
    }

    /**
     * Callback to assign modal after being loaded.
     *
     * @param modal
     *      FormModal
     */
    onLoaded(modal: FormModal): void {
        this.login = modal;
    }

    /**
     * Opens the modal.
     */
    openLoginModal(): void {
        this.login.show();
    }

    /**
     * Callback to invoke chosen action.
     *
     * @param action
     *      ModalAction of chosen action, CONFIRM or CANCEL
     */
    onAction(action: ModalAction): void {
        if(action == ModalAction.CONFIRM) {
            this.authorization.login(this.email, this.password).subscribe(response => {           
                if(response.status == 200) {
                    this.login.hide();
                    this.unauthorized = false;
                }
            },
            error => {
                this.unauthorized = true;
            });

        }
    }

}