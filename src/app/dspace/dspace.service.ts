import {Injectable} from 'angular2/core';

import {URLSearchParams} from 'angular2/http'; 

import {HttpService} from '../utilities/http.service';

/**
 * Injectable service to provide an interface with the DSpace REST API 
 * through the utility http service. The responses here are returned as
 * Observables and the content is mapped to a JSON object.
 *
 * It important to note that the methods in this service are referenced
 * with bracket notation combining fetch with a constant.
 * Such as: dspaceService['fetch' + dspaceKeys[type].METHOD]
 *
 * TODO: map the JSON content to an inheritence model
 */
@Injectable()
export class DSpaceService {

    /**
     * The DSpace REST API endpoint root
     */
    private REST: string;

    /**
     * The DSpace REST API URL
     */
    private url: string;

    /**
     * @param httpService 
     *      HttpService is a singleton service to provide basic xhr requests.
     */
    constructor(private httpService: HttpService) {
        this.REST = '/rest';
        this.url = 'http://localhost:5050';
    }

    /**
     * Method to perform a generic fetch with the provided path. 
     *
     * @param path
     *      A path to a DSpace REST endpoint
     */
    fetch(path) {
        console.log('fetching path ' + path);
        return this.httpService.get({
            url: this.url + path + '?expand=parentCommunity,parentCollection'
        });
    }

    /**
     * Method to fetch top communities for navigation purposes.
     */
    fetchTopCommunities() {
        //TODO: handle top community pagination
        var params = new URLSearchParams();
        params.append("limit", '200');
        params.append("offset", '0');
        return this.httpService.get({
            url: this.url + this.REST + '/communities/top-communities',
            search: params
        });
    }

    /**
     * Method to fetch subcommunities for navigation purposes.
     *
     * @param communityId
     *      The community id of which its subcommunities are to be fetched.
     */
    fetchCommunities(community) {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + community.id + '/communities',
            search: params
        });
    }

    /**
     * Method to fetch collections of a community for navigation purposes.
     *
     * @param communityId
     *      The community id of which its collections are to be fetched.
     */
    fetchCollections(community) {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + community.id + '/collections',
            search: params
        });
    }

    /**
     * Method to fetch items of a collection for navigation purposes. 
     *
     * @param collectionId
     *      The collection id of which its items are to be fetched.
     */
    fetchItems(collection) {
        var params = new URLSearchParams();
        params.append("limit", collection.limit);
        params.append("offset", collection.offset);
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + collection.id + '/items',
            search: params
        });
    }

    /**
     * Method to fetch details of a community. 
     *
     * @param id
     *      Community id of which to fetch its relationships and other details.
     */
    fetchCommunity(id) {
        //TODO: when working on pagination of communities and collections remove expand collections and subCommunities
        return this.httpService.get({
            url: this.url + this.REST + '/communities/' + id + '?expand=collections,subCommunities,parentCommunity,logo'
        });
    }

    /**
     * Method to fetch details of a collection. 
     *
     * @param id
     *      Collection id of which to fetch its relationships and other details.
     */
    fetchCollection(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/collections/' + id + '?expand=parentCommunity,logo'
        });
    }

    /**
     * Method to fetch details of an item. 
     *
     * @param id
     *      Item id of which to fetch its relationships and other details.
     */
    fetchItem(id) {
        return this.httpService.get({
            url: this.url + this.REST + '/items/' + id + '?expand=metadata,bitstreams,parentCollection'
        });
    }

    /**
     * Returns the newly submitted items to the dspace repository. (Ideally, I just return 5 items now.)
     */
    fetchRecentItems()
    {
        return this.httpService.get(
            {
                url: this.url + this.REST + "/items?expand=all"
            }
        );
    }

    /**
     * Method to login and recieve a token. 
     *
     * @param email
     *      DSpace user email/login
     * @param password
     *      DSpace user password
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
