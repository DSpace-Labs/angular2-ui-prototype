import {Component} from 'angular2/core';
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

/**
 * Home component. Intended to be a splash page with news, recent submissions, 
 * and user related content if logged in. Currently demonstrates server-side 
 * rendering of a simple template. 
 */
@Component({
    selector: 'home',
    pipes: [TranslatePipe],
    template: `
                <div class="container">
                    <h2>{{'home.title' | translate}}</h2>
                    <ul>
                        <li *ngFor="#template of serverTemplating">{{template}}</li>
                    </ul>
                </div>
              `
})
export class HomeComponent {

    /**
     * Simple array of strings templated in the view using *ngFor.
     */
    //serverTemplating = [welcome, "This is server side templated.", "SEO and Javascript."];
    serverTemplating = [];
    constructor(public translate : TranslateService)
    {
        translate.setDefaultLang('en');
        translate.use('en');
        translate.get(['home.welcome1','home.welcome2','home.welcome3']).subscribe((res : string) => {
            this.serverTemplating = [res["home.welcome1"],res["home.welcome2"],res["home.welcome3"]];
        })

    }


}