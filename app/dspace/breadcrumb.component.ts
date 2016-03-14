import {Component, View} from 'angular2/core';
import {Router} from 'angular2/router';

import {BreadcrumbService} from './breadcrumb.service';

@Component({
    selector: 'breadcrumb'
})
@View({
    template: ` 
                <ul class="list-inline breadcrumb">
                    <li *ngFor="#page of trail">
                        <a (click)="select(page)" class="clickable">{{page.name}}</a>
                    </li>
                </ul>
              `
})
export class BreadcrumbComponent {

    trail: Array<{}>;
            
    constructor(private router: Router, private breadcrumbService: BreadcrumbService) {
        this.buildTrail(this.breadcrumbService.getBreadcrumb());
    }

    buildTrail(context) {
        this.trail = new Array<{}>();
        if(context) {
            this.dropBreadcrumb(context);
        }        
        this.trail.unshift({ name: 'Dashboard', link: 'Dashboard', context: null });
    }

    select(breadcrumb) {
        if (breadcrumb.context != null) {
            this.breadcrumbService.visit(breadcrumb.context);
            this.buildTrail(breadcrumb.context);
        }
        this.router.navigate([breadcrumb.link]);
    }
    
    dropBreadcrumb(context) {
        this.trail.unshift({ name: context.name, link: context.link, context: context });
        if (context.parentCommunity) {
            this.dropBreadcrumb(context.parentCommunity);
        }
        if (context.parentCollection) {
            this.dropBreadcrumb(context.parentCollection);
        }
    }

}