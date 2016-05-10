import {Component, Input, OnInit} from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from 'angular2/router';
import {HomeSidebarComponent} from './home-sidebar.component';
import {CollectionSidebarComponent} from './collection-sidebar.component';

import { ContextProviderService } from '../../../dspace/services/context-provider.service';

import {AccountComponent} from './divisions/account.component';
import {BrowseComponent} from './divisions/browse.component';
import {HelpComponent} from './divisions/help.component';

/**
 * What appears in this sidebar is decided by the component currently active
 * Using the sidebarservice
 */
@Component({
    selector: "sidebar",
    directives: [ROUTER_DIRECTIVES, HomeSidebarComponent, CollectionSidebarComponent, BrowseComponent,HelpComponent,AccountComponent],
    template:
        `
            <h1>testing the sidebar </h1>
        <div class="">
        <!-- put some wordbreak here -->

            <!--
            <sidebar-browse></sidebar-browse>
            <sidebar-account></sidebar-account>
            <h4>Context</h4>
            <div *ngIf="dashboard()">
                <home-sidebar></home-sidebar>
            </div>

            <div *ngIf="collection()">
                <collection-sidebar></collection-sidebar>
            </div>
            <!-- normal parts -->

            <sidebar-help></sidebar-help>
            -->
        </div>
        `
})

export class SidebarComponent
{

    private context : any;

    constructor(private contextProvider: ContextProviderService)
    {
        if(contextProvider != null){
        this.context = contextProvider.context;
        contextProvider.contextObservable.subscribe( x => this.context = x);
        }
        console.log("in the sidebar constructor");
    }

    dashboard() : boolean
    {
        return this.context.type == "dashboard";
    }

    collection() : boolean
    {
        return this.context.type == "collection";
    }
}