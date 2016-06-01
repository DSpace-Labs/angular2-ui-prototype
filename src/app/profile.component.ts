import { Component } from '@angular/core';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from './dspace/authorization/services/authorization.service';
import { BreadcrumbService } from './navigation/services/breadcrumb.service';

import { Breadcrumb } from './navigation/models/breadcrumb.model';
import { User } from './dspace/models/user.model';

/**
 * Home component. Intended to be a splash page with news, recent submissions, 
 * and user related content if logged in. Currently demonstrates server-side 
 * rendering of a simple template. 
 */
@Component({
    selector: 'profile',
    pipes: [ TranslatePipe ],
    template: `
                <div *ngIf="user">
                    <h3>{{ user.fullname }}</h3>
                    <h4>{{ user.email }}</h4>
                </div>
                <hr *ngIf="user">
                
                <!--
                 This was to show how we can iterate over translations provided by the TranslateService (with typescript)
                <ul>
                    <li *ngFor="let template of serverTemplating">{{ template }}</li>
                </ul>
                --> 
                
                <h5>This is the profile page.</h5>
              `
})

/**
 * Component for the profile
 */
export class ProfileComponent {
        
    private breadcrumb: Breadcrumb = new Breadcrumb('profile', true);

    /**
     * Logged in user.
     */
    private user: User;

    /**
     * Simple array of strings templated in the view using *ngFor.
     */
    private serverTemplating: Array<String>;

    /**
     *
     * @param breadcrumbService
     *      BreadcrumbService is a singleton service to interact with the breadcrumb component.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumbService: BreadcrumbService,
                private authorization: AuthorizationService,
                private translate : TranslateService) {
        breadcrumbService.visit(this.breadcrumb);
        this.user = authorization.user;
        authorization.userObservable.subscribe(user => {
            this.user = user;
        });
        
        /*
            This shows how to use the TranslateService from within typescript instead of as a pipe.
            translate.get(['home.welcome1', 'home.welcome2', 'home.welcome3']).subscribe((res : string) => {
            this.serverTemplating = [res["home.welcome1"], res["home.welcome2"], res["home.welcome3"]];
        });
        */
    }


}
