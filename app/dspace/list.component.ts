import {Component, Input, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'list'
})
@View({
    directives: [CORE_DIRECTIVES],
    template: `
                <ul class="list-group">
                    <li *ngFor="#item of items" class="list-group-item">                        
                        <span (click)="select($event)" class="clickable">{{ item.name }}</span>
                    </li>
                </ul>
              `
})
export class ListComponent {

    @Input() items: Array<Object>;

    constructor() { }

    select(event) {
        console.log(event);
    }

}