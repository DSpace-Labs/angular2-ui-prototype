import {Component} from 'angular2/core';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'view-element',
    inputs: ['header'],
    template: `
                <div id="simple-view-element">
                    <h3 *ngIf="header">{{header}}</h3>
                    <ng-content></ng-content>
                </div>
              `
})
export class ViewElementComponent {

}