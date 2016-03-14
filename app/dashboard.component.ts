import {Component, View, ElementRef} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {DSpaceService} from './dspace/dspace.service';

import {TreeComponent} from './dspace/tree.component';

import {BreadcrumbComponent} from './dspace/breadcrumb.component';

@Component({
    selector: "dashboard"
})
@View({
    directives: [BreadcrumbComponent, TreeComponent],
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
                    
                    <h2>Dashboard</h2>

                    <tree [directories]="directory"></tree>

                </div>
              `
})
export class DashboardComponent {

    // template element
    elementRef: ElementRef;

    directory: Object;

    constructor(elementRef: ElementRef, private dSpaceService: DSpaceService) {
        this.elementRef = elementRef;

        console.log('DASHBOARD');
        this.dSpaceService.getDirectory().then(directory => {
            this.directory = directory;
        });

    }

    ngAfterViewInit() {
        
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