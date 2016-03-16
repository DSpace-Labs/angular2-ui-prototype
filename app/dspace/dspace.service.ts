import {EventEmitter, Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';

import {HttpService} from '../utils/http.service';

@Injectable()
export class DSpaceService {

    private REST: string;

    private url: String;

    private listing: Observer<Object[]>;
    
    private store: { directory: Object[] };

    directory: Observable<Object[]>;

    emitter: EventEmitter<Object>;

    constructor(private httpService: HttpService) {
        this.REST = '/tdl-rest';
        this.url = 'https://training-ir.tdl.org';
        this.store = { directory: [] };
        this.directory = new Observable(observer => this.listing = observer).share();
        this.emitter = new EventEmitter<Object>();
    }

    initDirectory() {
        
        this.fetchTopCommunities().subscribe(communities => {
            
            let prefetched = this.store.directory[0];

            if(prefetched) {
                for(let i in communities) {
                    let community = communities[i];
                    if(community['id'] == prefetched['id']) {
                        if(prefetched['subcommunities'].length > 0) {
                            community['subcommunities'] = prefetched['subcommunities'];
                        }
                        if(prefetched['collections'].length > 0) {
                            community['collections'] = prefetched['collections'];
                        }
                        this.emitTarget(community);
                        break;
                    }
                }
            }
           
            this.store.directory = communities;

            // dont like crafting paths
            this.store.directory.forEach(dir => {
                dir['path'] = this.craftPath(dir['type']);
                dir['component'] = this.craftComponent(dir['type']);
            })

            if(this.listing) {
                this.listing.next(this.store.directory);
            }

            this.recursiveBuild(this.store.directory);   

        });
    }

    emitTarget(context) {
        while(true) {
            if(context['type'] == 'community') {
                if(context['subcommunities'].length > 0) {
                    context = context['subcommunities'][0];
                }
                else if(context['collections'].length > 0) {
                    context = context['collections'][0];
                }
                else {
                    this.emitter.next(context);
                    return;
                }
            }
            else if(context['type'] == 'collection') {
                if(context['items'].length > 0) {
                    context = context['items'][0];
                }
                else {
                    this.emitter.next(context);
                    return;
                }
            }
            else if(context['type'] == 'item') {
                this.emitter.next(context);
                return;
            }
            else {
                console.log('DOH!');
                return;
            }
        }
    }

    getDirectory() {
        return this.store.directory;
    }

    buildPath(path) {
        let restPath = this.REST + path.charAt(0) + path.charAt(1).toLowerCase() + path.substring(2, path.length);
        return this.chainRequestPath({ target: null, previous: null, resolves: new Array<Object>() }, restPath);
    }

    chainRequestPath(dsort, path) {
        let dspace = this;
        return new Promise(function(res, rej) {
            
            dspace.fetch(path).subscribe(context => {

                console.log(context);

                // dont like crafting paths
                context['path'] = dspace.craftPath(context['type']);
                context['component'] = dspace.craftComponent(context['type']);

                context.expanded = false;
                context.toggle = function () {
                    this.expanded = !this.expanded;
                };
                
                if(dsort.resolves.length == 0) {
                    dsort.target = context;
                }
                
                dsort.resolves.push(res);

                if(dsort.prev) {

                    if(context.type == 'community') {
                        dsort.prev.parentCommunity = context;
                        context.subcommunities.push(dsort.prev);
                    }
                    else {
                        dsort.prev.parentCollection = context;
                        context.items.push(dsort.prev);
                    }

                }

                dsort.prev = context;

                if (context.parentCommunity) {
                    return dspace.chainRequestPath(dsort, context.parentCommunity['link']);
                }
                else if(context.parentCollection) {                    
                    return dspace.chainRequestPath(dsort, context.parentCollection['link']);                    
                }
                else {
                    dspace.store.directory.push(context);

                    dsort.resolves.forEach(resolve => {
                        resolve();
                    });
                }
                
            });



        });
    };



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
                    parentCommunity.component = this.craftComponent(parentCommunity.type);


                    parentCommunity.expanded = false;
                    parentCommunity.toggle = function () {
                        this.expanded = !this.expanded;
                    };

                    subCommunities.forEach(community => {
                        community.parentCommunity = parentCommunity;
                    });

                    parentCommunity.subcommunities = subCommunities;

                    if (subCommunities.length > 0) {
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
                        collection.component = this.craftComponent(collection.type);


                        collection.expanded = false;
                        collection.toggle = function () {
                            this.expanded = !this.expanded;
                        };

                        if (collection.numberItems > 0) {
                            
                            this.fetchItems(collection).subscribe(items => {
                                items.forEach(item => {


                                    // dont like crafting paths
                                    item.path = this.craftPath(item.type);
                                    item.component = this.craftComponent(item.type);


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
            url: this.url + this.REST + '/communities/' + communityId + '/communities'
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
            url: this.url + this.REST + '/communities/' + communityId + '/collections'
        });
    }


    fetchItems(collection) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + collection.id + '/items'
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

    //TODO: do something about these

    craftPath(dsoType) {
        switch (dsoType) {
            case 'community': return '/Communities';
            case 'collection': return '/Collections';
            case 'item': return '/Items';
            default: return '/Home';
        }
    }


    craftComponent(dsoType) {
        switch (dsoType) {
            case 'community': return 'Communities';
            case 'collection': return 'Collections';
            case 'item': return 'Items';
            default: return 'Home';
        }
    }

}
