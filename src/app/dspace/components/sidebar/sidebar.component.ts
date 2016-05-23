import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';

import { ContextProviderService } from '../../../dspace/services/context-provider.service';
import {SidebarService} from '../../../utilities/services/sidebar.service.ts';
import {SidebarSection} from '../../models/sidebar/sidebar-section.model';
import {SidebarSectionComponent} from './sidebar-section.component';
/**
 * Main component to render the sidebar. Will access the sidebarservice to find out how much components need to be rendered.
 * Using the sidebarservice
 */
@Component({
    selector: "sidebar",
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    template:
        `


            <div id="sidebar" class="sidebar-offcanvas">
                <aside class="sidebar-menu">
                    <section *ngFor="let component of sidebarComponents" class="">
                        <sidebar-section class="sidebar-section" [sidebarcomponent]="component"></sidebar-section>
                    </section>
                </aside>
            </div>

            <!-- testing bootstrap -->
            <div class="panel-heading">
                <h3>TestingBootstrap</h3>
            </div>
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
     *
     * @param contextProvider
     * @param sidebarService
     */
    constructor(private contextProvider: ContextProviderService, private sidebarService : SidebarService)
    {
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