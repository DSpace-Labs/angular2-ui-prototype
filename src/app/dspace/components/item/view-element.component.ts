import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

import { ArrayUtil } from '../../../utilities/commons/array.util';

/**
 * Component for the collections of the simple-item-view.
 */
@Component({
    selector: 'view-element',
    directives: [ NgClass ],
    template: `
                <div class="simple-view-element">
                    <h4 class="simple-view-element-header" [ngClass]="classesAsString(headerClasses)" *ngIf="header">{{ header }}</h4>
                    <div class="simple-view-element-body" [ngClass]="classesAsString(bodyClasses)" >
                        <ng-content></ng-content>
                    </div>
                </div>
              `
})
export class ViewElementComponent {

    /**
     *
     */
    @Input() private header: string;

    /**
     *
     */
    @Input() private headerClasses: Array<string>;

    /**
     *
     */
    @Input() private bodyClasses: Array<string>;

    /**
     * 
     */
    private classesAsString(classArray: Array<string>) {
        if (ArrayUtil.isEmpty(classArray)) {
            return "";
        } else {
            return classArray.join(' ');
        }
    }

}
