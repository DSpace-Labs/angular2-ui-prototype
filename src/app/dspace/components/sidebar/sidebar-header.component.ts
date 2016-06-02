import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { TranslatePipe } from "ng2-translate/ng2-translate";
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { DROPDOWN_DIRECTIVES } from "ng2-bootstrap/ng2-bootstrap";
import { SidebarService } from "../../../utilities/services/sidebar.service";
import { AuthorizationService } from "../../authorization/services/authorization.service";
import { User } from "../../models/user.model";

@Component({
    selector: 'sidebar-header',
    directives: [ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES, CORE_DIRECTIVES],
    pipes: [ TranslatePipe ],
    template:
        `
        <div class="sidebar-header">
            <div class="row no-gutter sidebar-header-content">
                <div class="col-xs-10 col-sm-12">
                  <a *ngIf="!user" [routerLink]="['Login']" class="sidebar-header-element"><span
                        class="ion-icon ion-log-in space-right"></span>{{
                    'header.login' | translate }}</a>
                  <div *ngIf="user" dropdown (on-toggle)="toggled($event)">
                    <a href id="simple-dropdown" class="sidebar-header-element" dropdownToggle>
                      {{user.fullname }}
                      <span class="ion-icon ion-ios-arrow-down icon-arrow-down"></span>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="simple-dropdown">
                      <li>
                        <a [routerLink]="['Logout']" class="dropdown-item">{{'header.logout' | translate }}</a>
                      </li>
                      <li>
                        <a [routerLink]="['Profile']" class="dropdown-item">{{'header.profile' | translate }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-xs-2 visible-xs">
                    <a (click)="toggleSidebar()" class="sidebar-close-button sidebar-header-element pull-right clickable"><span
                                class="ion-icon ion-ios-close-outline"></span></a>
                </div>
            </div>
        </div>
            `
})
export class SidebarHeaderComponent {
    public disabled:boolean = false;
    public status:{ isopen:boolean } = { isopen: false };
    public items:Array<string> = ['The first choice!',
        'And another choice for you.', 'but wait! A third!'];

    /**
     * Logged in user.
     */
    private user: User;

    /**
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param sidebarService
     *      SidebarService is a singleton service that provides access to the content of the sidebar
     */
    constructor(private sidebarService : SidebarService,
                private authorization: AuthorizationService
    )
    {
        this.user = authorization.user;

        authorization.userObservable.subscribe(user => {
            this.user = user;
        });

    }

    /**
     * Show or hide the sidebar.
     */
    toggleSidebar() {
        this.sidebarService.toggleSidebarVisibility();
    }

}