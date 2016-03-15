import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {HttpService} from '../utils/http.service'

@Injectable()
export class DSpaceService {

    url: string;

    // maintain heirachy and content
    directory: {};
    
    topCommunities: {};
        
    constructor(private window: Window, private httpService: HttpService) {
        this.url = 'https://training-ir.tdl.org/tdl-rest';
        
        this.directory = {
            data: null,
            ready: false
        }

        this.topCommunities = {
            data: null,
            ready: false
        }
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

    getItem(item) {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            if (item['second']) {
                resolve(item);
            }
            else {
                dspace.fetchItem(item.id).subscribe((data) => {
                    // TODO: Copy what is needed. Don't just overwrite.
                    // like angular.extend, custom relations made on client side
                    item['metadata'] = data.metadata;
                    console.log(data);
                    item['bitstreams'] = data.bitstreams;
                    console.log(item);
                    resolve(item);
                    item['second'] = true;
                });
            }
        });
    }

    // Expand metadata. Request bitstreams later.
    fetchItem(itemId) {
        return this.httpService.get({
            url: this.url + '/items/' + itemId + '?expand=metadata,bitstreams'
        }).map(res => {
            return JSON.parse(res);
        });
    }

    // Resolve top level communities as soon as possible.
    getDirectory() {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            if (dspace.directory['ready']) {
                resolve(dspace.directory['data']);
            }
            else {
                dspace.getTopCommunities().then(topCommunities => {
                    dspace.directory['data'] = topCommunities;

                    // dont like crafting paths
                    dspace.directory['data'].forEach(dir => {
                        dir.path = dspace.craftPath(dir.type);
                    })

                    resolve(dspace.directory['data']);

                    dspace.buildDirectory().then(() => {
                        console.log('DIRECTORY LOADED');
                        this.window.prerenderReady = true;
                    });

                    

                });
            }
        });
    }

    getTopCommunities() {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            if (dspace.topCommunities['ready']) {
                resolve(dspace.topCommunities['data']);
            }
            else {
                dspace.fetchTopCommunities().subscribe((data) => {
                    dspace.topCommunities['data'] = data;
                    resolve(dspace.topCommunities['data']);
                    dspace.topCommunities['ready'] = true;
                });
            }
        });
    }

    fetchTopCommunities() {
        return this.httpService.get({
            url: this.url + '/communities/top-communities'
        }).map(res => {
            return JSON.parse(res);
        });
    }

    // Build and populate directory asynchronously.
    buildDirectory() {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            dspace.directory['ready'] = true;
            dspace.recursiveBuild(resolve, dspace.directory['data']);
        });
    }

    // Recursively build directory.
    recursiveBuild(resolve, communityArray) {
        let dspace = this;


        this.combineSubCommunities(communityArray).subscribe((communities) => {
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
                    dspace.recursiveBuild(resolve, subCommunities);
                }
                else {
                    //TODO: should actually resolve when both subscriptions are complete
                    resolve();
                }
            }
        });


        this.combineCommunityCollections(communityArray).subscribe((collections) => {
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
                        dspace.fetchItems(collection).subscribe(items => {
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

    fetchItems(collection) {
        return this.httpService.get({
            url: this.url + '/collections/' + collection.id + '/items'
        }).map(res => {
            return JSON.parse(res);
        });
    }

    combineSubCommunities(objArray) {
        let observableBatch = [];
        objArray.forEach(obj => {
            observableBatch.push(this.fetchCommunitySubCommunities(obj.id));
        });
        return Observable.forkJoin(observableBatch);
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
        }).map(res => {
            return JSON.parse(res);
        });
    }

    fetchCommunitySubCommunities(communityId) {
        return this.httpService.get({
            url: this.url + '/communities/' + communityId + '/communities'
        }).map(res => {
            return JSON.parse(res);
        });
    }

}