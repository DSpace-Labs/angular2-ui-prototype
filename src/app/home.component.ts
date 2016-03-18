import {Component} from 'angular2/core';

@Component({
    selector: 'home',
    template: `
                <div>
                    <h2>Home</h2>
                    <ul>
                        <li *ngFor="#template of serverTemplating">{{template}}</li>
                    </ul>
                </div>
              `
})
export class HomeComponent {
    serverTemplating = ["Hello, World!", "This is server side templating", "Blah blah blah"];
}