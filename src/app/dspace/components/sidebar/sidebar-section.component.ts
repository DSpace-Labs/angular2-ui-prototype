import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';
import { ArrayUtil } from '../../../utilities/commons/array.util';
import { ObjectUtil } from '../../../utilities/commons/object.util';
import { SidebarSection} from '../../models/sidebar/sidebar-section.model';
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

/**
 * Main component to render the sidebar. Will access the sidebarservice to find out how much components need to be rendered.
 * Using the sidebarservice
 */
@Component({
    selector: "sidebar-section",
    pipes: [TranslatePipe],
    directives: [ROUTER_DIRECTIVES, SidebarSectionComponent],
    template:
        `
            <div *ngIf="sidebarcomponent.visible" class="">
            <!-- if this component has children we want to render it w/o a link -->

            <div *ngIf="isRouteSection()">
                <!-- this is rendered if there is a route -->
                <div *ngIf="!hasDestination()" class="sidebar-heading">
                    <h3 class="panel-title">{{ sidebarcomponent.componentName | translate}}</h3>
                </div>

                <div *ngIf="hasDestination()" class="sidebar-link">
                    <a [routerLink]="getAllParams()">{{ sidebarcomponent.componentName | translate }}</a>
                </div>
            </div>

            <div *ngIf="!isRouteSection()" class=""> <!-- it has a url instead of a route -->
                <div *ngIf="!hasDestination()" class="sidebar-simple-section-element">
                    <span>{{sidebarcomponent.componentName | translate}}</span>
                </div>
                <div *ngIf="hasDestination()">
                    <a [href]="sidebarcomponent.url">{{sidebarcomponent.componentName}}</a>
                </div>
            </div>

                <!-- render the children of this component -->
                <div class="sidebar-section" *ngIf="hasChildren()" >
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
     *
     */
    @Input() private sidebarcomponent : SidebarSection;

    /**
     *
     */
    children : Array<SidebarSection>;

    /**
     *
     */
    constructor()
    {
    }


    /**
     * Returns the parameters for the router.
     * @returns {Array}
     */
    getAllParams()
    {
        let routes = [];

        // check if the sidebar has routes
        if(ArrayUtil.isNotEmpty(this.sidebarcomponent.Routes)){
            this.sidebarcomponent.Routes.forEach(route =>
            {
                routes.push(route.name);
                if(route.params!=null)
                {
                    routes.push(route.params);
                }
            });
            return routes;
        }
        return null; // well we want to return something else here.
    }


    /**
     *
     */
    ngOnInit()
    {
        this.children = this.sidebarcomponent.childsections;
    }


    visibleChildren()
    {
        return this.children.filter(child => child.visible);
    }

    /**
     *
     * @returns {boolean}
     */
    hasChildren() : boolean
    {
        return (ArrayUtil.isNotEmpty(this.children)) ? true : false;
    }

    /**
     *
     * Checks whether there is a route or a url set.
     * @returns {boolean}
     */
    hasDestination() : boolean
    {
        // a destination is a url or a route
        return ArrayUtil.isNotEmpty(this.sidebarcomponent.Routes) || ObjectUtil.hasValue(this.sidebarcomponent.url);
    }

    /**
     *
     * @returns {boolean}
     */
    hasParams() : boolean
    {
        return false;
    }

    isRouteSection()
    {
        return ArrayUtil.isNotEmpty(this.sidebarcomponent.Routes);
    }

}