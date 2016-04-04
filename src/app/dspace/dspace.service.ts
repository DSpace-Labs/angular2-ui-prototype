import {Injectable} from 'angular2/core';

import {HttpService} from '../utilities/http.service';

/**
 * 
 */
@Injectable()
export class DSpaceService {

    /**
     * 
     */
    private REST: string;

    /**
     * 
     */
    private url: string;

    /**
     * 
     */
    constructor(private httpService: HttpService) {
        this.REST = '/rest';
        this.url = 'http://localhost:5050';
    }

    /**
     * 
     */
    fetch(path) {
        return this.httpService.get({
            url: this.url + path + '?expand=parentCommunity,parentCollection'
        });
    }

    /**
     * 
     */
    fetchTopCommunities() {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/top-communities'
        });
    }

    /**
     * 
     */
    fetchCommunities(communityId) {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + communityId + '/communities'
        });
    }

    /**
     * 
     */
    fetchCollections(communityId) {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + communityId + '/collections'
        });
    }

    /**
     * 
     */
    fetchItems(collectionId) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + collectionId + '/items'
        });
    }

    /**
     * 
     */
    fetchCommunity(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + id + '?expand=collections,subCommunities,parentCommunity'
        });
    }

    /**
     * 
     */
    fetchCollection(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + id + '?expand=items,parentCommunity'
        });
    }

    /**
     * 
     */
    fetchItem(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/items/' + id + '?expand=metadata,bitstreams,parentCollection'
        });
    }

    /**
     * 
     */
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
