import {Component, Input, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';
import { ArrayUtil } from '../../../utilities/commons/array.util';
import { ObjectUtil } from '../../../utilities/commons/object.util';
import { SidebarSection} from '../../models/sidebar/sidebar-section.model';
import { TranslatePipe } from "ng2-translate/ng2-translate";

/**
 * Main component to render a sidebar-section
 * Will only render the visible sections, and the children of these elements.
 * Using the sidebarservice
 */
@Component({
    selector: "sidebar-section",
    pipes: [TranslatePipe],
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    template:
        `
            <!--//TODO for sidebar design, I temporarily disabled visibility, turn it back on-->
            <!--<div *ngIf="sidebarcomponent.visible" class="panel panel-default">-->
            <div class="panel panel-default">
                <!-- if this component has children we want to render it w/o a link -->

                <!-- it is not a route section, it may or may not have a destination (url) -->
                <div *ngIf="isHeading()" class="panel-heading sidebar-heading clickable" (click)="toggleOpen()">
                    <h4 class="panel-title">{{sidebarcomponent.componentName | translate}} <i [ngClass]="{'ion-ios-arrow-up':isOpen, 'ion-ios-arrow-down':!isOpen}" class="pull-right ion-icon ion-ios-arrow-up"></i></h4>
                </div>
                <div *ngIf="isExternalLink()">
                    <a [href]="sidebarcomponent.url">{{sidebarcomponent.componentName}}</a>
                </div>

                <div *ngIf="isRouteSection()"> <!-- if it is a route section, it also has a destination -->
                    <div class="sidebar-link">
                        <a [routerLink]="getRouteParams()">{{ sidebarcomponent.componentName | translate }}</a>
                    </div>
                </div>

                    <!-- render the children of this component -->
                    <div class="sidebar-section panel-body" *ngIf="isOpen && hasChildren()" >
                        <ul>
                            <li *ngFor="let child of visibleChildren()" class="sidebar-simple-section-element">
                               <sidebar-section class="sidebar-child" *ngIf="child" [sidebarcomponent]="child"></sidebar-section>
                            </li>
                        </ul>
                    </div>
            </div>
        `
})



export class SidebarSectionComponent implements OnInit
{

    /**
     *  The current sidebar-section that we will be rendering
     */
    @Input() private sidebarcomponent : SidebarSection;

    /**
     *  The children of the current sidebar-section
     */
    children : Array<SidebarSection>;

    isOpen: boolean;

    /**
     *
     */
    constructor()
    {
        this.isOpen = true;
    }


    /**
     * Returns the parameters for the route
     * @returns {Array}
     */
    getRouteParams()
    {
        let routes = [];

        // check if the sidebar has routes
        if(ArrayUtil.isNotEmpty(this.sidebarcomponent.routes)){
            this.sidebarcomponent.routes.forEach(route =>
            {
                routes.push(route.name);
                if(route.params!=null)
                {
                    routes.push(route.params);
                }
            });
            return routes;
        }
        return null;
    }


    /**
     *
     */
    ngOnInit()
    {
        this.children = this.sidebarcomponent.childsections;
    }


    /**
     * Returns the children of the current component whom have their visibility set to 'true'
     * @returns {T[]|SidebarSection[]}
     */
    visibleChildren()
    {
        //TODO for sidebar design, I temporarily disabled visibility, turn it back on
        // return this.children.filter(child => child.visible);
        return this.children;
    }

    /**
     * Checks if the current component has child components
     * @returns {boolean}
     */
    hasChildren() : boolean
    {
        return (ArrayUtil.isNotEmpty(this.children)) ? true : false;
    }

    /**
     *
     * Checks whether there is a route or a url set.
     *
     * @returns {boolean}
     */
    hasDestination() : boolean
    {
        // a destination is a url or a route
        return ArrayUtil.isNotEmpty(this.sidebarcomponent.routes) || ObjectUtil.hasValue(this.sidebarcomponent.url);
    }


    /**
     * Will check if the current sidebar-section has routes, if this is the case, it is a 'RouteSection'
     * In case a URL is provided as well, preference will still be given to the Route.
     * @returns {boolean}
     */
    isRouteSection() : boolean
    {
        return ArrayUtil.isNotEmpty(this.sidebarcomponent.routes);
    }


    /**
     * Check whether the current sidebar-section should be rendered as a heading.
     *
     * @returns {boolean}
     *      true if it isn't a route and doesn't have a destination
     */
    isHeading() : boolean
    {
        return !this.isRouteSection() && !this.hasDestination();
    }


    /**
     * Check whether the current sidebar-section should be rendered as an external link.
     *
     * @returns {boolean}
     *      true if it isn't a route and has a destination
     */
    isExternalLink() : boolean
    {
        return !this.isRouteSection() && this.hasDestination();
    }

    toggleOpen(): void {
        this.isOpen = !this.isOpen;
    }

}