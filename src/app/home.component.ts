import {Component} from 'angular2/core';

/**
 * 
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
     * 
     */
    serverTemplating = ["Hello, World!", "This is server side templated.", "SEO and Javascript."];

}