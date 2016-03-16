import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

import {DSpaceService} from './dspace.service';

@Injectable()
export class BreadcrumbService {

    emitter: EventEmitter<Object>;
    
    breadcrumb: any;
                        
    constructor(private dspaceService: DSpaceService) {
        this.breadcrumb = {};
        this.emitter = new EventEmitter<Object>();
    }

    visit(context) {
        this.breadcrumb = context;
        this.emitter.next(this.breadcrumb);
    }
    
    getBreadcrumb() {
        return this.breadcrumb;
    }
    
    loadAsyncPath(path) {

        this.dspaceService.emitter.subscribe(context => {
            console.log(context)
            this.visit(context)
        })

        return this.dspaceService.buildPath(path);
    }

}