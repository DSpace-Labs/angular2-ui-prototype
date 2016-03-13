import {Component, Input, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

@Component({
    selector: 'list'
})
@View({
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    template: `
                <ul class="list-group">
                    <li *ngFor="#item of items" class="list-group-item">                        
                        <a (click)="select(item)" class="clickable">{{ item.name }}</a>
                    </li>
                </ul>
              `
})
export class ListComponent {

    @Input() items: Array<Object>;

    constructor() { }

    select(item) {
        console.log(item);
    }

}