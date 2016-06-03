import { Component } from '@angular/core';


/**
 * Just a page which will show some static 'news' content.
 */
@Component({
    selector : "news",
    template:   `
                    <h1 class="page-header"> Welcome to the DSpace Angular 2 UI prototype</h1>

                    <p class="lead">
                        The goal of this <a href="https://github.com/DSpace-Labs/angular2-ui-prototype" target="_blank">angular2-ui-prototype</a> is to evaluate the <a href="https://angular.io/" target="_blank">Angular 2 framework</a> as a plausible DSpace UI platform.
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
                    <p>
                        This prototype is a collaboration by <a href="https://www.atmire.com/" 
                        target="_blank">Atmire</a>, <a href="http://www.cineca.it/" target="_blank
                        ">Cineca</a>, <a href="http://www.duraspace.org/" target="_blank">DuraSpace</a> 
                        and <a href="https://www.tamu.edu/" target="_blank">Texas A&M</a>.
                    <p>

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
