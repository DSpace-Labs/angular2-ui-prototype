import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';
import { ArrayUtil } from '../../../utilities/commons/array.util';
import { ObjectUtil } from '../../../utilities/commons/object.util';
import { SidebarSection} from '../../models/sidebar/sidebar-section.model';
import { RouteSidebarSection } from '../../models/sidebar/routesidebar-section.model';
import { HrefSidebarSection } from '../../models/sidebar/hrefsidebar-section.model';
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
            <div *ngIf="sidebarcomponent.visible" class="panel panel-default">

            <!-- if this component has children we want to render it w/o a link -->

            <div *ngIf="isRouteSection()">
                <!-- this is rendered if there is a route -->
                <div *ngIf="!hasRoute()" class="panel-heading">
                    <h3 class="panel-title">{{sidebarcomponent.componentName | translate}}</h3>
                </div>

                <div *ngIf="hasRoute()">
                    <a [routerLink]="getAllParams()">{{ sidebarcomponent.componentName | translate }}</a>
                </div>
            </div>

            <div *ngIf="!isRouteSection()">
                <a [href]="sidebarcomponent.url">{{sidebarcomponent.urlname}}</a>
            </div>

                <!-- render the children of this component -->
                <div class="child-section" *ngIf="hasChildren()" >
                    <ul>
                        <li *ngFor="let child of visibleChildren()" class="panel">
                           <sidebar-section *ngIf="child" [sidebarcomponent]="child"></sidebar-section>
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
        if(this.sidebarcomponent instanceof RouteSidebarSection){
            let routesidebarsection = this.sidebarcomponent as RouteSidebarSection;
            routesidebarsection.Routes.forEach(route =>
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
     * @returns {boolean}
     */
    hasRoute() : boolean
    {
        if(this.sidebarcomponent instanceof RouteSidebarSection)
        {
            let routesidebar = this.sidebarcomponent as RouteSidebarSection;
            return ArrayUtil.isNotEmpty(routesidebar.Routes);
        }
        return false;
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
        console.log(this.sidebarcomponent.componentName);
        console.log(this.sidebarcomponent instanceof RouteSidebarSection);
        return this.sidebarcomponent instanceof RouteSidebarSection;
    }

}