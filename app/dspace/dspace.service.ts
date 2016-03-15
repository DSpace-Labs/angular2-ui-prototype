import {Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';

import {HttpService} from '../utils/http.service';

@Injectable()
export class DSpaceService {

    directory: Observable<Object[]>;

    private url: String;

    private listing: Observer<Object[]>;
    
    private store: {
        directory: Object[]
    };

    constructor(private httpService: HttpService) {
        this.url = 'https://training-ir.tdl.org/tdl-rest';
        this.directory = new Observable(observer => this.listing = observer).share();
        this.store = { directory: [] };
    }

    getDirectory() {
        return this.store.directory;
    }

    initDirectory() {
        
        this.fetchTopCommunities().subscribe(data => {
           
            this.store.directory = data;

            // dont like crafting paths
            this.store.directory.forEach(dir => {
                dir['path'] = this.craftPath(dir['type']);
            })

            this.listing.next(this.store.directory);

            this.recursiveBuild(this.store.directory);   

        });
    }

    fetchTopCommunities() {
        return this.httpService.get({
            url: this.url + '/communities/top-communities'
        });
    }

    // Recursively build directory.
    recursiveBuild(communityArray) {
        
        let observableBatch = [];
        
        observableBatch.push(this.combineSubCommunities(communityArray));
        
        observableBatch.push(this.combineCommunityCollections(communityArray));
        
        Observable.forkJoin(observableBatch).subscribe(dso => {
            
            var communities = dso[0];
            {
                for (let i in communities) {
                    let subCommunities = communities[i];
                    let parentCommunity = communityArray[i];

                    // dont like crafting paths
                    parentCommunity.path = this.craftPath(parentCommunity.type);

                    parentCommunity.expanded = false;
                    parentCommunity.toggle = function () {
                        this.expanded = !this.expanded;
                    };

                    subCommunities.forEach(community => {
                        community.parentCommunity = parentCommunity;
                    });

                    parentCommunity.subcommunities = subCommunities;

                    if (subCommunities.length > 0) {
                        // recursion
                        this.recursiveBuild(subCommunities);
                    }
                }
            }

            var collections = dso[1];
            {
                for (let i in collections) {
                    let communityCollections = collections[i];
                    let parentCommunity = communityArray[i];

                    communityCollections.forEach(collection => {
                        collection.parentCommunity = parentCommunity;
                        
                        // dont like crafting paths
                        collection.path = this.craftPath(collection.type);

                        collection.expanded = false;
                        collection.toggle = function () {
                            this.expanded = !this.expanded;
                        };

                        if (collection.numberItems > 0) {
                            
                            this.fetchItems(collection).subscribe(items => {
                                items.forEach(item => {

                                    // dont like crafting paths
                                    item.path = this.craftPath(item.type);

                                    item.parentCollection = collection;
                                });
                                collection.items = items;
                            });

                        }

                    });

                    parentCommunity.collections = communityCollections;
                }
            }
        });
    }


    combineSubCommunities(objArray) {
        let observableBatch = [];
        objArray.forEach(obj => {
            observableBatch.push(this.fetchCommunitySubCommunities(obj.id));
        });
        return Observable.forkJoin(observableBatch);
    }

    fetchCommunitySubCommunities(communityId) {
        return this.httpService.get({
            url: this.url + '/communities/' + communityId + '/communities'
        });
    }


    combineCommunityCollections(objArray) {
        let observableBatch = [];
        objArray.forEach(obj => {
            observableBatch.push(this.fetchCommunityCollections(obj.id));
        });
        return Observable.forkJoin(observableBatch);
    }

    fetchCommunityCollections(communityId) {
        return this.httpService.get({
            url: this.url + '/communities/' + communityId + '/collections'
        });
    }


    fetchItems(collection) {
        return this.httpService.get({
            url: this.url + '/collections/' + collection.id + '/items'
        });
    }


    getItem(item) {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            dspace.fetchItem(item.id).subscribe((data) => {
                // TODO: Copy what is needed. Don't just overwrite.
                // like angular.extend, custom relations made on client side
                item['metadata'] = data.metadata;
                item['bitstreams'] = data.bitstreams;
                resolve(item);
                item['second'] = true;
            });
        });
    }


    // Expand metadata. Request bitstreams later.
    fetchItem(itemId) {
        return this.httpService.get({
            url: this.url + '/items/' + itemId + '?expand=metadata,bitstreams'
        });
    }


    login(email, password) {
        this.httpService.post({
            url: this.url + '/login',
            data: {
                email: email,
                password: password
            }
        }); 
    }


    craftPath(dsoType) {
        switch (dsoType) {
            case 'community': return '/Communities';
            case 'collection': return '/Collections';
            case 'item': return '/Items';
            default: return '/Home';
        }
    }

}