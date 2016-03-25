import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {DSpaceService} from './dspace.service';

@Injectable()
export class DSpaceCommunities {

    store: {
        communities: {
            context: Object[],
            observer: Observer<Object[]>,
            loader: Function,
            loading: boolean,
            ready: boolean
        }
    };

    communities: Observable<Object[]>;

    constructor(private dspaceService: DSpaceService) {
        this.store = {
            communities: {
                context: new Array<Object>(),
                observer: null,
                loader: this.loadCommunity,
                loading: false,
                ready: false
            }
        };
        this.communities = new Observable<Object[]>(observer => this.store.communities.observer = observer).share();
    }

    ngOnInit() {
        console.log(this.store);
    }

    loadCommunities(parentCommunityId) {
        
    }

    loadCommunity(id) {

    } 

}
