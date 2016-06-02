import { Component } from '@angular/core';


/**
 * Just a page which will show some static 'news' content.
 */
@Component({
    selector : "news",
    template:   `
                    <h1> Welcome to the DSpace Angular 2 UI prototype</h1>

                    <p>
                        This <a href="https://angular.io/">Angular 2</a> UI prototype is a collaboration by @mire, Cineca, DuraSpace and Texas A&M.
                    <p>

                    <p>
                        The goal of this <a href="https://github.com/DSpace-Labs/angular2-ui-prototype">angular2-ui-prototype</a> is to evaluate the Angular 2 framework as a plausible DSpace UI platform.
                        This includes evaluating whether it meets the SEO needs of Google Scholar.
                    </p>

                    <p>
                        We are currently in phase two of development, which is preparing the prototype for the OR16 Conference in Dublin.
                        This phase includes, but is not limited to:
                    </p>
                    <ul>
                        <li>Basic Authentication / Authorization</li>
                        <li>Ability to create Communities, Collections, Items</li>
                        <li>Improved theme (loosely based on Mirage 2)</li>
                        <li>Dynamically editable sidebar menu</li>
                        <li>Configurable, type-based deposit forms</li>
                    </ul>

                `
})

/**
 *
 */
export class NewsComponent{


    constructor()
    {
    }
}
