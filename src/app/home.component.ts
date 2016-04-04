import {Component} from 'angular2/core';

/**
 * Home component. Intended to be a splash page with news, recent submissions, 
 * and user related content if logged in. Currently demonstrates server-side 
 * rendering of a simple template. 
 */
@Component({
    selector: 'home',
    template: `
                <div class="container">
                    <h2>Home</h2>
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
    serverTemplating = ["Hello, World!", "This is server side templated.", "SEO and Javascript."];

}