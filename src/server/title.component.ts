import { Component } from '@angular/core';

/**
 * Title component for server side rendering of the title.
 * The title is a html element within the head of the document.
 */
@Component({
    selector: 'title',
    template: `{{ title }}`
})
export class TitleComponent {

    /**
     * Document title as a string.
     */
    title: string;

    constructor() {
        this.title = 'Angular 2 DSpace';
    }

    /**
     * Sets the document title.
     * 
     * @param title  Value of title to set.
     */
    setTitle(title) {
        this.title = title;
    }

}
