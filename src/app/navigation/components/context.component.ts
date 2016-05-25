import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../../dspace/authorization/services/authorization.service';
import { ContextProviderService } from '../../dspace/services/context-provider.service';

import { User } from '../../dspace/models/user.model';

/**
 * Context aware component for displaying information/functionality of
 * the current context. Can be either a community, collection, or an item.
 *
 * @deprecated: replaced by the SidebarComponent. File still left here as reference material
 */
@Component({
    selector: 'context',
    directives: [ ROUTER_DIRECTIVES ],
    pipes: [ TranslatePipe ],
    template: `
                <div class="panel panel-default" *ngIf="context">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{context.name}}</h3>
                    </div>
                    <div class="panel-body" *ngIf="dashboard()">
                        <ul *ngIf="user">
                            <li><a [routerLink]="['/CommunityCreate']">{{ 'context.create-community' | translate }}</a></li>
                        </ul>
                    </div>
                    <div class="panel-body" *ngIf="home()">
                        
                    </div>
                    <div class="panel-body" *ngIf="login()">
                        
                    </div>
                    <div class="panel-body" *ngIf="register()">
                        
                    </div>
                    <div class="panel-body" *ngIf="settings()">
                        
                    </div>
                    <div class="panel-body" *ngIf="setup()">
                        
                    </div>
                    <div class="panel-body" *ngIf="community()">
                        <ul *ngIf="user">
                            <li><a [routerLink]="['/CommunityCreate']">{{ 'context.create-community' | translate }}</a></li>
                            <li><a [routerLink]="['/CollectionCreate']">{{ 'context.create-collection' | translate }}</a></li>
                        </ul>
                        <div *ngIf="context.sidebarText" [innerHTML]="context.sidebarText"></div>
                    </div>
                    <div class="panel-body" *ngIf="collection()">
                        <ul *ngIf="user">
                            <li><a [routerLink]="['/ItemCreate']">{{ 'context.create-item' | translate }}</a></li>
                        </ul>
                        <div *ngIf="context.sidebarText" [innerHTML]="context.sidebarText"></div>
                    </div>
                    <div class="panel-body" *ngIf="item()">
                        <div *ngIf="user">{{ 'context.edit-item' | translate }}</div>
                    </div>
                </div>
              `
})
export class ContextComponent {

    /**
     *
     */
    private user: User;

    /**
     * An input variable that is passed into the component [context].
     * Represents the current context.
     */
    private context: any;

    /**
     *
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     */
    constructor(private authorization: AuthorizationService,
                private contextProvider: ContextProviderService) {
        this.user = authorization.user;
        authorization.userObservable.subscribe(user => {
            this.user = user;
        });
        this.context = contextProvider.context;
        contextProvider.contextObservable.subscribe(currentContext => {
            this.context = currentContext;
        });
    }

    /**
     *
     */
    private dashboard(): boolean {
        return this.context.type == 'dashboard';
    }

    /**
     *
     */
    private home(): boolean {
        return this.context.type == 'home';
    }

    /**
     *
     */
    private login(): boolean {
        return this.context.type == 'login';
    }

    /**
     *
     */
    private register(): boolean {
        return this.context.type == 'register';
    }

    /**
     *
     */
    private settings(): boolean {
        return this.context.type == 'settings';
    }

    /**
     *
     */
    private setup(): boolean {
        return this.context.type == 'setup';
    }

    /**
     *
     */
    private community(): boolean {
        return this.context.type == 'community';
    }

    /**
     *
     */
    private collection(): boolean {
        return this.context.type == 'collection';
    }

    /**
     *
     */
    private item(): boolean {
        return this.context.type == 'item';
    }

}