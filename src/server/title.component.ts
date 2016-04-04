import {Component} from 'angular2/core';

@Component({
    selector: 'title',
    template: `{{ title }}`
})
export class TitleComponent {

    title: string;

    constructor() {
        this.title = 'DSpace UI';
    }

    setTitle(title) {
        this.title = title;
    }

}
