import { Component } from '@angular/core';


/**
 * Just a page which will show some static 'news' content.
 */
@Component({
    selector : "news",
    template:   ` 
                    <h1> Welcome to the Angular 2 prototype, for the new DSpace UI</h1>
                    
                    <p>
                        This project represents the "extended prototype" featuring Angular 2 from the DSpace UI Prototype Challenge. 
                        This prototype is a collaboration by @mire, Cineca, DuraSpace and Texas A&M.
                    <p>
                   
                    <p>
                        The goal of this extended prototype is to evaluate the Angular 2 framework as a plausible DSpace UI platform. 
                        This includes evaluating whether it meets the SEO needs of Google Scholar.
                    </p>
                    
                    <p>
                        We are currently in phase two of development, which is preparing the prototype for the OR16 Conference in Dublin. 
                        This prototype will include, but is not limited to:
                    </p>
                    <ul>
                        <li>Basic Authentication</li>
                        <li>Editing / Creating of communities, Collections, Items</li>
                        <li>Improved theme (likely similar to Mirage 2)</li>
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
