import {Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import { ContextProviderService } from '../../../dspace/services/context-provider.service';
import { SidebarService } from '../../../utilities/services/sidebar.service.ts';
import { SidebarSectionComponent } from './sidebar-section.component';

import { User } from "../../models/user.model";
import {AuthorizationService} from "../../authorization/services/authorization.service";

/**
 * Main component to render the sidebar.
 * Will access the sidebarservice to find out which components need to be rendered.
 */
@Component({
    selector: "sidebar",
    styles : ["sidebar"],
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    pipes: [ TranslatePipe ],
    template:
        `


            <nav class="sidebar">
                <!--TODO extract header-->
                <div class="sidebar-header">
                    <div class="navbar-inverse">
                        <ul class="nav navbar-nav" *ngIf="!user">
                            <!--<li><a [routerLink]="['/Register']"><span class="ion-icon ion-ios-person-outline space-right"></span>{{ 'header.register' | translate }}</a></li>-->
                            <li><a [routerLink]="['Login']" class="clickable"><span
                                    class="ion-icon ion-log-in space-right"></span>{{
                                'header.login' | translate }}</a></li>
                        </ul>
                        <ul class="nav navbar-nav" *ngIf="user">
                            <li class="sidebar-header-btn has-right-border"><a [routerLink]="['/Home']"><span
                                    class="ion-icon ion-ios-person-outline space-right"></span>{{
                                user.fullname }}</a></li>
                            <li class="sidebar-header-btn has-left-border"><a [routerLink]="['Logout']" class="clickable"><span
                                    class="ion-icon ion-log-out space-right"></span>{{
                                'header.logout' | translate }}</a></li>
                        </ul>
                    </div>
                </div>
                
                <section *ngFor="let component of sidebarComponents">
                    <!--//TODO for sidebar design, I temporarily disabled visibility, turn it back on-->
                    <!--<sidebar-section *ngIf="component.visible" class="sidebar-section" [sidebarcomponent]="component"></sidebar-section>-->
                    <sidebar-section class="sidebar-section" [sidebarcomponent]="component"></sidebar-section>
                </section>
            </nav>
        `
})

export class SidebarComponent
{

    /**
     *
     */
    private context : any;

    /**
     *
     */
    private sidebarComponents;


    /**
     * Logged in user.
     */
    private user: User;

    /**
     *
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param sidebarService
     *      SidebarService is a singleton service that provides access to the content of the sidebar
     */
    constructor(private contextProvider: ContextProviderService,
                private authorization: AuthorizationService,
                private sidebarService : SidebarService
    )
    {
        this.user = authorization.user;

        authorization.userObservable.subscribe(user => {
            this.user = user;
        });

        if(contextProvider != null) {
            // when we update the context, we could update the sidebar.
            this.context = contextProvider.context;
            contextProvider.contextObservable.subscribe(x => this.context = x);
        }
        // Catch any event that causes the components array to change.
        this.sidebarComponents = this.sidebarService.components;
        sidebarService.sidebarSubject.subscribe(() =>
        {
            this.sidebarComponents = sidebarService.components;
        });
    }

}