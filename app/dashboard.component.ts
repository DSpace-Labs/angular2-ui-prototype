import {Component, View, ElementRef} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {DirectoryComponent} from './dspace/directory.component';

@Component({
    selector: "dashboard"
})
@View({
    directives: [DirectoryComponent],
    template: `
                <div class="container"
                    (document:keydown)="onKeyDown($event)"
                    (window:resize)="onResize($event)" 
                    (mousedown)="onMouseDown($event)" 
                    (mousemove)="onMouseMove($event)" 
                    (mouseup)="onMouseUp($event)"
                    (mouseenter)="onMouseEnter($event)"
                    (mouseleave)="onMouseLeave($event)">
                    
                    <h2>Dashboard</h2>
                    <directory></directory>

                </div>
              `
})
export class DashboardComponent {

    // template element
    elementRef: ElementRef;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngAfterViewInit() {
        console.log("Dashboard initialized.");
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