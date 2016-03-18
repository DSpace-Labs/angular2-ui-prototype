import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';

import {HttpService} from '../utils/http.service';

@Injectable()
export class DSpaceService {

    private REST: string;

    private url: String;

    private observer: {
        item: Observer<Object>,
        collection: Observer<Object[]>,
        community: Observer<Object[]>,
        directory: Observer<Object[]>
    }
    
    private store: {
        item: Object,
        collection: Object[],
        community: Object[],
        directory: Object[]
    };

    item: Observable<Object>;
    collection: Observable<Object[]>;
    community: Observable<Object[]>;
    directory: Observable<Object[]>;
    
    constructor(private httpService: HttpService) {
        this.REST = '/rest';
        this.url = 'https://demo.dspace.org';
        this.store = {
            item: new Object(),
            collection: new Array<Object>(),
            community: new Array<Object>(),
            directory: new Array<Object>()
        };
        this.item = new Observable(observer => this.observer.item = observer).share();
        this.collection = new Observable(observer => this.observer.collection = observer).share();
        this.community = new Observable(observer => this.observer.community = observer).share();
        this.directory = new Observable(observer => this.observer.directory = observer).share();
    }

    initialize() {
        console.log('Initializing DSpace Service!');

        console.log(this.store);
        console.log(this.observer);

        this.fetchTopCommunities().subscribe(
            topCommunities => {
                console.log(topCommunities);
                this.store.directory = topCommunities;
                this.observer.directory.next(this.store.directory);
            },
            error => {
                console.error('Error: ' + error);
            },
            () => {
                console.log('finished');
            }
        );

    }

    fetch(path) {
        return this.httpService.get({
            url: this.url + path + '?expand=parentCommunity,parentCollection'
        });
    }

    fetchTopCommunities() {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/top-communities'
        });
    }


    fetchCommunitySubCommunities(communityId) {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + communityId + '/communities'
        });
    }


    fetchCommunityCollections(communityId) {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + communityId + '/collections'
        });
    }


    fetchItems(collection) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + collection.id + '/items'
        });
    }

    fetchItem(itemId) {
        return this.httpService.get({
            url: this.url + this.REST + '/items/' + itemId + '?expand=metadata,bitstreams'
        });
    }

    login(email, password) {
        this.httpService.post({
            url: this.url + this.REST + '/login',
            data: {
                email: email,
                password: password
            }
        }); 
    }

}
