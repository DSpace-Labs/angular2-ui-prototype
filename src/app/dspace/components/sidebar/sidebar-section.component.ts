import {Component, Input, OnInit} from '@angular/core';
import { ROUTER_DIRECTIVES, RouteConfig, Router } from '@angular/router-deprecated';
import { ArrayUtil } from '../../../utilities/commons/array.util';
import { ObjectUtil } from '../../../utilities/commons/object.util';
import { SidebarSection} from '../../models/sidebar-section.model';
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
                <div *ngIf="!hasRoute()" class="panel-heading">
                    <h3 class="panel-title">{{sidebarcomponent.componentName | translate}}</h3>
                </div>

                <div *ngIf="hasRoute()">
                    <a [routerLink]="getAllParams()">{{ sidebarcomponent.componentName | translate }}</a>
                </div>


                <!-- render the children of this component -->
                <div class="child-section" *ngIf="hasChildren()" >
                    <ul>
                        <li *ngFor="let child of children" class="panel">
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
        return ArrayUtil.isNotEmpty(this.sidebarcomponent.Routes);
    }

    /**
     *
     * @returns {boolean}
     */
    hasParams() : boolean
    {
        return false;
    }

}