import {Injectable} from 'angular2/core';

import {HttpService} from '../utilities/http.service';

@Injectable()
export class DSpaceService {

    private REST: string;

    private url: string;

    constructor(private httpService: HttpService) {
        this.REST = '/tdl-rest';
        this.url = 'https://training-ir.tdl.org';
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

    fetchItems(collectionId) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + collectionId + '/items'
        });
    }

    fetchCommunity(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + id + '?expand=collections,subcommunities,parentCommunity'
        });
    }

    fetchCollection(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + id + '?expand=items,parentCommunity'
        });
    }

    fetchItem(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/items/' + id + '?expand=metadata,bitstreams,parentCollection'
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
