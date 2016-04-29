import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../services/authorization.service';

import {Modal, ModalAction} from '../../../utilities/components/modal.component';

/**
 *
 */
@Component({
  	selector: 'login-form',
  	directives: [Modal],
  	pipes: [TranslatePipe],
  	template: `
  				      <modal id="login"
                       [title]="'Login'"
                       [cancel-label]="'Cancel'"
                       [confirm-label]="'Login'"
                       [valid]="loginEmail.valid && loginPassword.valid"
                       (loaded)="onLoaded($event)"
                       (action)="onAction($event)">

                        <fieldset class="form-group" [class.has-error]="!loginEmail.valid && !loginEmail.pristine">
                            <label for="login-email">Email address</label>
                            <input type="email" 
                                   id="login-email" 
                                   placeholder="Enter email" 
                                   [(ngModel)]="email"
                                   #loginEmail="ngForm"
                                   class="form-control"
                                   pattern="\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\w+)*(\\.\\w{2,3})+"
                                   required>

                            <span [hidden]="loginEmail.valid || loginEmail.pristine" class="validaiton-helper">
                                <span *ngIf="loginEmail.errors && loginEmail.errors.pattern">
                                    Invalid email
                                </span>
                                <span *ngIf="loginEmail.errors && loginEmail.errors.required">
                                    Email is required
                                </span>
                            </span>
                        </fieldset>
                        <fieldset class="form-group" [class.has-error]="!loginPassword.valid && !loginPassword.pristine">
                            <label for="login-password">Password</label>
                            <input type="password" 
                                   id="login-password" 
                                   placeholder="Enter password" 
                                   [(ngModel)]="password"
                                   #loginPassword="ngForm"
                                   class="form-control"
                                   minlength="6"
                                   required>

                            <span [hidden]="loginPassword.valid || loginPassword.pristine" class="validaiton-helper">
                                <span *ngIf="loginPassword.errors && loginPassword.errors.minlength">
                                    Password must be at least 6 characters
                                </span>
                                <span *ngIf="loginPassword.errors && loginPassword.errors.required">
                                    Password is required
                                </span>
                            </span>
                        </fieldset>
                        <span *ngIf="unauthorized" class="validaiton-helper">
                            Incorrect email or password
                        </span>
                    

                </modal>
              `
})
export class LoginFormComponent {

    /**
     *
     */
	  private login: Modal;

    /**
     *
     */
    private email: string;

    /**
     *
     */
    private password: string;

    /**
     *
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
     *
     */
    onLoaded(modal: Modal): void {
        this.login = modal;
    }

    /**
     *
     */
    openLoginModal(): void {
        this.login.show();
    }

    /**
     *
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