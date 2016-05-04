import {Component} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import {BreadcrumbService} from './navigation/services/breadcrumb.service';

/**
 * Home component. Intended to be a splash page with news, recent submissions, 
 * and user related content if logged in. Currently demonstrates server-side 
 * rendering of a simple template. 
 */
@Component({
    selector: 'home',
    pipes: [TranslatePipe],
    template: `
                <ul>
                    <li *ngFor="let template of serverTemplating">{{template}}</li>
                </ul>
              `
})
export class HomeComponent {

    /**
     * Simple array of strings templated in the view using *ngFor.
     */
    serverTemplating: Array<String>;

    /**
     *
     * @param translate
     *      TranslateService
     */
    constructor(private breadcrumb: BreadcrumbService,
                private translate : TranslateService)
    {
        breadcrumb.visit({
            name: 'Home',
            type: 'home',
            component: '/Home',
            root: true,
        });
        translate.setDefaultLang('en');
        translate.use('en');
        translate.get(['home.welcome1', 'home.welcome2', 'home.welcome3']).subscribe((res : string) => {
            this.serverTemplating = [res["home.welcome1"], res["home.welcome2"], res["home.welcome3"]];
        });
    }


}
