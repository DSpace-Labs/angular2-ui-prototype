import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';
import { ArrayUtil } from '../../../utilities/commons/array.util';
import { SidebarSection} from '../../models/sidebar-section.model';

/**
 * Main component to render the sidebar. Will access the sidebarservice to find out how much components need to be rendered.
 * Using the sidebarservice
 */
@Component({
    selector: "sidebar-section",
    inputs: ["sidebarcomponent"],
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    template:
        `
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">{{sidebarcomponent.componentName}}</h3>
                </div>
                <div class="panel-body">
                    <ul class="panel-body">
                        <li *ngFor="let route of sidebarcomponent.keys()" class="panel">
                              <a [routerLink]="[sidebarcomponent.routes[route]]"> {{ route }} </a>
                        </li>
                    </ul>

                    <!-- render the children of this component -->
                    <div class="child-section" *ngIf="hasChildren()" *ngFor="let child of children">
                        <sidebar-section *ngIf="child" [sidebarcomponent]="child"></sidebar-section>
                    </div>
                </div>
            </div>
        `
})

export class SidebarSectionComponent implements OnInit
{

    /**
     *
     */
    sidebarcomponent : SidebarSection;

    /**
     *
     */
    children : Array<SidebarSection>;

    constructor()
    {
    }

    /**
     *
     */
    ngOnInit()
    {
        this.children = this.sidebarcomponent.childsections;
    }


    /**
     *
     * @returns {boolean}
     */
    hasChildren()
    {
        return (ArrayUtil.isNotEmpty(this.children)) ? true : false;
    }

}