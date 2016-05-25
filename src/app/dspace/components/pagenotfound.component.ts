import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { TranslatePipe } from "ng2-translate/ng2-translate";

import {BreadcrumbService} from "../../navigation/services/breadcrumb.service";
import {Breadcrumb} from "../../navigation/models/breadcrumb.model";

/**
 * Component to show a simple 'page not found' message.
 */
@Component({
    pipes: [TranslatePipe],
    directives: [ROUTER_DIRECTIVES],
    template:
              `
                <div class="page-not-found">
                    <h1>404</h1>
                    <h2><small>{{"404.page-not-found" | translate}}</small></h2>
                    <br>
                    <p>{{"404.help" | translate}}</p>
                    <br>
                    <p class="text-center">
                      <a [routerLink]="['/Dashboard']" class="btn btn-primary">{{"404.link.home-page" | translate}}</a>
                    </p>
                </div>
              `
})

/**
 * A simple 404 page.
 */
export class PageNotFoundComponent {
    private breadcrumb: Breadcrumb = new Breadcrumb('404', false);


    constructor(private breadcrumbService: BreadcrumbService) {
        breadcrumbService.visit(this.breadcrumb);
    }
}
