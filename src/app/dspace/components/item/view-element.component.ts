import { Component, Input } from '@angular/core';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'view-element',
    template: `
                <div class="simple-view-element">
                    <h3 *ngIf="header">{{ header }}</h3>
                    <ng-content></ng-content>
                </div>
              `
})
export class ViewElementComponent {

    /**
     *
     */
    @Input() private header: string;

}
