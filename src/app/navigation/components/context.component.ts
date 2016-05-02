import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {AuthorizationService} from '../../dspace/authorization/services/authorization.service';
import {ContextProviderService} from '../../dspace/services/context-provider.service';

import {User} from '../../dspace/models/user.model';

/**
 * Context aware component for displaying information/functionality of
 * the current context. Can be either a community, collection, or an item.
 */
@Component({
    selector: 'context',
    directives: [ROUTER_DIRECTIVES],
    pipes: [TranslatePipe],
    template: `
                <div class="panel panel-default" *ngIf="context">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{context.name}}</h3>
                    </div>
                    <div class="panel-body" *ngIf="context.type == 'dashboard'">
                        <ul *ngIf="user">
                            <li><a [routerLink]="['/CommunityCreate']">{{ 'context.create-community' | translate }}</a></li>
                        </ul>
                    </div>
                    <div class="panel-body" *ngIf="context.type == 'community'">
                        <ul *ngIf="user">
                            <li><a [routerLink]="[context.component, { id: context.id }, 'CommunityCreate']">{{ 'context.create-community' | translate }}</a></li>
                            <li><a [routerLink]="[context.component, { id: context.id }, 'CollectionCreate']">{{ 'context.create-collection' | translate }}</a></li>
                        </ul>
                        <div *ngIf="context.sidebarText" [innerHTML]="context.sidebarText"></div>
                    </div>
                    <div class="panel-body" *ngIf="context.type == 'collection'">
                        <ul *ngIf="user">
                            <li><a [routerLink]="[context.component, { id: context.id }, 'ItemCreate']">{{ 'context.create-item' | translate }}</a></li>
                        </ul>
                        <div *ngIf="context.sidebarText" [innerHTML]="context.sidebarText"></div>
                    </div>
                    <div class="panel-body" *ngIf="context.type == 'item'">
                        <div *ngIf="user">
                            {{ 'context.edit-item' | translate }}
                        </div>
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
     */
    constructor(private authorization: AuthorizationService,
                private contextProvider: ContextProviderService,
                private translate: TranslateService) {
        this.user = authorization.user;
        authorization.userObservable.subscribe(user => {
            this.user = user;
        });
        this.context = contextProvider.context;
        contextProvider.contextObservable.subscribe(currentContext => {
            this.context = currentContext;
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

}