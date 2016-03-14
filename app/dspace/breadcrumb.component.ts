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
        this.trail = new Array<{}>();
        this.dropBreadcrumb(this.breadcrumbService.getBreadcrumb());
        this.trail.unshift({ name: 'Dashboard', link: 'Dashboard', context: null });
    }

    select(breadcrumb) {

        this.breadcrumbService.visit(breadcrumb.context);

        this.trail = new Array<{}>();
        
        if (breadcrumb.context != null) {
            this.dropBreadcrumb(breadcrumb.context);            
        }

        this.trail.unshift({ name: 'Dashboard', link: 'Dashboard', context: null });        

        this.router.navigate([breadcrumb.link]);

    }
    
    dropBreadcrumb(context) {
        if (context != undefined) {
            this.trail.unshift({ name: context.name, link: this.filterLink(context.link), context: context });            
            if (context.parentCommunity) {
                this.dropBreadcrumb(context.parentCommunity);
            }
            if (context.parentCollection) {
                this.dropBreadcrumb(context.parentCollection);
            }
        }
    }

    filterLink(badLink) {
        let goodLink = badLink;
        let start = 0;
        if ((start = goodLink.indexOf('/communities')) > 0) {
            goodLink = '/Communities' + goodLink.substring(start + 12, goodLink.length);
        }
        else if ((start = goodLink.indexOf('/collections')) > 0) {
            goodLink = '/Collections' + goodLink.substring(start + 12, goodLink.length);
        }
        else if ((start = goodLink.indexOf('/items')) > 0) {
            goodLink = '/Items' + goodLink.substring(start + 6, goodLink.length);
        }
        else {
            console.log('doh');
        }
        return goodLink;
    }

}