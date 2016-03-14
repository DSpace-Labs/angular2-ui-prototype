import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

@Injectable()
export class BreadcrumbService {

    emitter: EventEmitter<Object>;

    breadcrumb: any;
                
    constructor() {
        this.emitter = new EventEmitter<Object>();
    }

    visit(context) {
        this.breadcrumb = context;
        this.emitter.next(this.breadcrumb);
    }
    
    getBreadcrumb() {
        return this.breadcrumb;
    }

}