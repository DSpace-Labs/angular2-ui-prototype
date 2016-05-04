import {Component} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Router} from 'angular2/router';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../services/authorization.service';
import {BreadcrumbService} from '../../../navigation/services/breadcrumb.service';

/**
 * 
 */
@Component({
    selector: 'login',
    pipes: [TranslatePipe],
    template: `
                <form *ngIf="active" class="login-form" (ngSubmit)="login()" novalidate>
                	
                	<fieldset class="form-group" [class.has-error]="!loginEmail.valid && !loginEmail.pristine">
                        <label for="login-email">{{'login.email-gloss' | translate}}</label>
                        <input type="text" 
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

                    <div class="form-loader">
                        <img *ngIf="loading" src="./static/images/loading.gif" alt="Loading">
                    </div>

                    <span class="pull-right">
	                	<button type="button" class="btn btn-default btn-sm" (click)="cancel()">{{'login.cancel' | translate}}</button>
	                    <button type="submit" class="btn btn-primary btn-sm" [disabled]="!loginEmail.valid || !loginPassword.valid">{{'login.confirm' | translate}}</button>
                	</span>
                </form>
              `
})
export class LoginComponent {

	/**
	 *
	 */
	private active: boolean = true;

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
     * Indicates form is being processed.
     */
    private loading: boolean = false;

    /**
     *
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param translate
     *      TranslateService
     */
    constructor(private authorization: AuthorizationService,
    			private breadcrumb: BreadcrumbService,
                private translate: TranslateService,
                private router: Router) {
        breadcrumb.visit({
            name: 'Login',
            type: 'login',
            component: '/Login',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

    login(): void {
    	this.loading = true;
        this.authorization.login(this.email, this.password).subscribe(response => {           
            if(response.status == 200) {
                let token = response.text();
                this.authorization.status(token).subscribe(response => {
                	this.router.navigate(['/Home']);
                    this.reset();
                },
                error => {
                	this.loading = false;
                    this.unauthorized = true;
                });
            }
        },
        error => {
        	this.loading = false;
            this.unauthorized = true;
        });
    }

    cancel(): void {
    	this.reset();
    }

    reset(): void {
        this.email = '';
        this.password = '';
        this.active = false;
        this.loading = false;
        this.unauthorized = false;
        setTimeout(() => this.active = true, 0);
    }

}
