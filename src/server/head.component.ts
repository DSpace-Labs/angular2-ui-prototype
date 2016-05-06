import {Component} from 'angular2/core';

/**
 * Title component for server side rendering of the title.
 * The title is a html element within the head of the document.
 */
@Component({
    selector: 'head',
    template: `
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base href="/">
        <title>{{ title }}</title>
`
})
export class HeadComponent {

    /**
     * Document title as a string.
     */
    title: string;

    constructor() {
        this.title = 'DSpace UI';
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
