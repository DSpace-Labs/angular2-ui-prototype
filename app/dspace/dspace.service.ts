import {Injectable} from 'angular2/core';
import {Observable, Observer} from 'rxjs/Rx';

import {HttpService} from '../utils/http.service';

@Injectable()
export class DSpaceService {

    directory: Observable<Object[]>;

    private REST: string;

    private url: String;

    private listing: Observer<Object[]>;
    
    private store: {
        directory: Object[]
    };

    constructor(private httpService: HttpService) {
        this.REST = '/tdl-rest';
        this.url = 'https://training-ir.tdl.org';
        this.directory = new Observable(observer => this.listing = observer).share();
        this.store = { directory: [] };
    }

    initDirectory() {
        
        this.fetchTopCommunities().subscribe(data => {
           
            this.store.directory = data;

            // dont like crafting paths
            this.store.directory.forEach(dir => {
                dir['path'] = this.craftPath(dir['type']);
                dir['component'] = this.craftComponent(dir['type']);
            })

            if(this.listing) this.listing.next(this.store.directory);

            this.recursiveBuild(this.store.directory);   

        });
    }

    getDirectory() {
        return this.store.directory;
    }

    buildTrail(path) {
        let trail = new Array<Object>();
        let restPath = this.REST + path.charAt(0) + path.charAt(1).toLowerCase() + path.substring(2, path.length);
        return this.chainRequestPath(trail, restPath);
    }

    // build trail and get details
    chainRequestPath(trail, path) {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            dspace.fetch(path).subscribe((dso) => {
                trail.push(dso);
                if (dso.parentCommunity) {                    
                    resolve(dspace.chainRequestPath(trail, dso.parentCommunity['link']));
                }
                resolve(trail);
            });

        })
    }


    // still have to wait for the directory to complete
    find(target, dsoList) {
        console.log(dsoList);

        for (let i in dsoList) {
            let dso = dsoList[i];

            console.log(dso['id'] + ' ' + dso['type'])
            if (dso['id'] == target.id && dso['type'] == target.type) {
                console.log('>>>>>>>>>>>>>>>>> MATCH 1')
                console.log(dso);
                return dso;
            }


            console.log(dso['collections'].length)

            for (let j in dso['collections']) {
                let collection = dso['collections'][j];

                console.log(collection['id'] + ' ' + collection['type'])
                if (collection['id'] == target.id && collection['type'] == target.type) {
                    console.log('>>>>>>>>>>>>>>>>>>> MATCH 2')
                    console.log(collection);
                    return collection;
                }

                console.log(collection['numberItems']);
                if (collection['numberItems'] > 0) {
                    for (let k in collection['items']) {
                        let item = collection['items'][k];
                        console.log(item['id'] + ' ' + item['type'])
                        if (item['id'] == target.id && item['type'] == target.type) {
                            console.log('>>>>>>>>>>>>>>>>>>>>> MATCH 3')
                            collection(item)
                            return item;
                        }
                    }
                }
            }



            if (dso['subcommunities'].length > 0) {
                return this.find(target, dso['subcommunities']);
            }


        }
        console.log('DOH!!!!!!!!!!!!!!!!')
        return null;
    }

    
    fetch(path) {
        return this.httpService.get({
            url: this.url + path + '?expand=parentCommunity'
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