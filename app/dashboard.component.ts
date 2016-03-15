import {Component, View, ElementRef} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {DSpaceService} from './dspace/dspace.service';
import {BreadcrumbService} from './dspace/breadcrumb.service';

import {TreeComponent} from './dspace/tree.component';
import {ContextComponent} from './dspace/context.component';
import {BreadcrumbComponent} from './dspace/breadcrumb.component';

@Component({
    selector: "dashboard"
})
@View({
    directives: [ContextComponent, BreadcrumbComponent, TreeComponent],
    template: `
                <div class="container"
                    (document:keydown)="onKeyDown($event)"
                    (window:resize)="onResize($event)" 
                    (mousedown)="onMouseDown($event)" 
                    (mousemove)="onMouseMove($event)" 
                    (mouseup)="onMouseUp($event)"
                    (mouseenter)="onMouseEnter($event)"
                    (mouseleave)="onMouseLeave($event)">
                    
                    <breadcrumb></breadcrumb>

                    <div class="col-md-4">
                        <context [context]="dashboard"></context>
                    </div>

                    <div class="col-md-8">
                        <tree [directories]="directory"></tree>
                    </div>

                </div>
              `
})
export class DashboardComponent {

    // template element
    elementRef: ElementRef;

    directory: Object;

    dashboard: {};

    constructor(elementRef: ElementRef, private dSpaceService: DSpaceService, private breadcrumbService: BreadcrumbService) {
        this.elementRef = elementRef;
        this.dashboard = {
            name: 'Dashboard',
            path: '/Dashboard',
            type: 'dashboard'
        }
        this.dSpaceService.getDirectory().then(directory => {
            this.directory = directory;
        });
    }

    ngOnInit() {
        // Properties are resolved and things like
        // this.mapWindow and this.mapControls
        // had a chance to resolve from the
        // two child components <map-window> and <map-controls>
    }

    ngOnDestroy() {
        // Speak now or forever hold your peace
    }

    ngDoCheck() {
        // Custom change detection
    }

    ngOnChanges(changes) {
        // Called right after our bindings have been checked but only
        // if one of our bindings has changed.
        //
        // changes is an object of the format:
        // {
        //   'prop': PropertyUpdate
        // }
    }

    ngAfterContentInit() {
        // Component content has been initialized
    }

    ngAfterContentChecked() {
        // Component content has been Checked
    }

    ngAfterViewInit() {
        // Component views are initialized
    }

    ngAfterViewChecked() {
        // Component views have been checked
    }

    onKeyDown(event) {

    }

    onResize(event) {

    }

    onMouseDown(event) {
        
    }

    onMouseMove(event) {

    }

    onMouseUp(event) {

    }

    onMouseEnter(event) {

    }

    onMouseLeave(event) {

    }

    
    
}