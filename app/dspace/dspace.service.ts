import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {HttpService} from '../utils/http.service'

@Injectable()
export class DSpaceService {

    url: string;

    directory: {};

    topCommunities: {};
        
    constructor(private httpService: HttpService) {
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

    // resolve top level communities as soon as possible
    getDirectory() {
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

    fetchTopCommunities() {
        return this.httpService.get({
            url: this.url + '/communities/top-communities'
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

                parentCommunity.link = dspace.filterLink(parentCommunity.link);

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

                    collection.link = dspace.filterLink(collection.link);

                    collection.expanded = false;
                    collection.toggle = function () {
                        this.expanded = !this.expanded;
                    };

                    if (collection.numberItems > 0) {
                        dspace.fetchItems(collection).subscribe(items => {
                            items.forEach(item => {

                                item.link = dspace.filterLink(item.link);

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

    filterLink(badLink) {
        let goodLink = badLink;
        let start = 0;
        if ((start = goodLink.indexOf('/communities')) > 0) {
            goodLink = '/Communities' + goodLink.substring(start + 12, goodLink.length);
        }
        else if ((start = goodLink.indexOf('/collections')) > 0) {
            goodLink = '/Collections' + goodLink.substring(start + 12, goodLink.length);
        }
        else if ((start = goodLink.indexOf('/items')) > 0) {
            goodLink = '/Items' + goodLink.substring(start + 6, goodLink.length);
        }
        else {
            console.log('doh');
        }
        return goodLink;
    }

}