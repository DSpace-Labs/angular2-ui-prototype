import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {HttpService} from '../utils/http.service'

@Injectable()
export class DSpaceService {

    url: string;

    items: {};

    directory: {};

    collections: {};

    communities: {};

    topCommunities: {};
        
    constructor(private httpService: HttpService) {
        this.url = 'https://training-ir.tdl.org/tdl-rest';

        this.items = {
            data: null,
            ready: false
        }

        this.directory = {
            data: null,
            ready: false
        }

        this.collections = {
            data: null,
            ready: false
        }

        this.communities = {
            data: null,
            ready: false
        }

        this.topCommunities = {
            data: null,
            ready: false
        }
    }

    // resolve top level communities as soon as possible
    getDirectory() {
        console.log("Building Community/Collection Tree.");
        let dspace = this;
        return new Promise(function (resolve, reject) {
            if (dspace.directory['ready']) {
                resolve(dspace.directory['data']);
            }
            else {
                dspace.getTopCommunities().then(topCommunities => {
                    dspace.directory['data'] = topCommunities;
                    resolve(dspace.directory['data']);
                    dspace.buildDirectory();
                });
            }
        });
    }

    // build and populate directory asynchronously
    buildDirectory() {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            dspace.directory['ready'] = true;
            dspace.recursiveBuild(dspace.directory['data']);
        });
    }

    // recursively build directory
    recursiveBuild(communityArray) {
        let dspace = this;
        this.combineSubCommunities(communityArray).subscribe((communities) => {
            for (let i in communities) {
                let subCommunities = communities[i];
                let parentCommunity = communityArray[i];

                parentCommunity.expanded = false;
                parentCommunity.toggle = function () {
                    this.expanded = !this.expanded;
                };

                subCommunities.forEach(community => {
                    community.parentCommunity = parentCommunity;
                });

                parentCommunity.subcommunities = subCommunities;

                if (subCommunities.length > 0) {
                    dspace.recursiveBuild(subCommunities);
                }
            }
        });
        this.combineCommunityCollections(communityArray).subscribe((collections) => {
            for (let i in collections) {
                let communityCollections = collections[i];
                let parentCommunity = communityArray[i];

                communityCollections.forEach(collection => {
                    collection.parentCommunity = parentCommunity;

                    collection.expanded = false;
                    collection.toggle = function () {
                        this.expanded = !this.expanded;
                    };

                    dspace.fetchItems(collection).subscribe(items => {
                        items.forEach(item => {
                            item.parentCollection = collection;
                        });
                        collection.items = items;
                    });

                });

                parentCommunity.collections = communityCollections;
            }
        });
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

    getUrl() {
        return this.url;
    }

    fetchTopCommunities() {
        return this.httpService.get({
            url: this.url + '/communities/top-communities'
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
                    dspace.topCommunities['data'] = JSON.parse(data);
                    resolve(dspace.topCommunities['data']);
                    dspace.topCommunities['ready'] = true;
                });;
            }
        });
    }

    fetchCommunities() {
        return this.httpService.get({
            url: this.url + '/communities'
        });
    }

    getCommunities() {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            if (dspace.communities['ready']) {
                resolve(dspace.communities['data']);
            }
            else {
                dspace.fetchCommunities().subscribe((data) => {
                    dspace.communities['data'] = JSON.parse(data);
                    resolve(dspace.communities['data']);
                    dspace.communities['ready'] = true;
                });;
            }
        });
    }

    fetchCollections() {
        return this.httpService.get({
            url: this.url + '/collections'
        });
    }

    getCollections() {
        let dspace = this;
        return new Promise(function (resolve, reject) {
            if (dspace.collections['ready']) {
                resolve(dspace.collections['data']);
            }
            else {
                dspace.fetchCollections().subscribe((data) => {
                    dspace.collections['data'] = JSON.parse(data);
                    resolve(dspace.collections['data']);
                    dspace.collections['ready'] = true;
                });;
            }
        });
    }

}