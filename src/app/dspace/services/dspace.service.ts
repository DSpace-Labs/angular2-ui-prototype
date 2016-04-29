import {Injectable} from 'angular2/core';
import {Response, URLSearchParams} from 'angular2/http';
import {Observable} from "rxjs/Observable";

import {HttpService} from '../../utilities/http.service';
import {Community} from '../models/community.model';
import {Collection} from '../models/collection.model';
import {Item} from '../models/item.model';
import {URLHelper} from "../../utilities/url.helper";


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
     * @param httpService 
     *      HttpService is a singleton service to provide basic xhr requests.
     */
    constructor(private httpService: HttpService) {
    }

    /**
     * Method to fetch top communities for navigation purposes.
     */
    fetchTopCommunities(): Observable<Array<Community>> {
        //TODO: handle top community pagination
        var params = new URLSearchParams();
        params.append("limit", '200');
        params.append("offset", '0');
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/top-communities'),
            search: params
        }).map(json => {
            let topCommunities = new Array<Community>();
            for(let communityJson of json) {
                topCommunities.push(new Community(communityJson));
            }
            return topCommunities;
        });
    }

    /**
     * Method to fetch subcommunities for navigation purposes.
     *
     * @param communityId
     *      The community id of which its subcommunities are to be fetched.
     */
    fetchCommunities(community): Observable<Array<Community>> {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/' + community.id + '/communities'),
            search: params
        }).map(json => {
            let communities = new Array<Community>();
            for(let communityJson of json) {
                communities.push(new Community(communityJson));
            }
            return communities;
        });
    }

    /**
     * Method to fetch collections of a community for navigation purposes.
     *
     * @param communityId
     *      The community id of which its collections are to be fetched.
     */
    fetchCollections(community): Observable<Array<Collection>> {
        var params = new URLSearchParams();
        params.append("limit", community.limit);
        params.append("offset", community.offset);
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/' + community.id + '/collections'),
            search: params
        }).map(json => {
            let collections = new Array<Collection>();
            for(let collectionJson of json) {
                collections.push(new Collection(collectionJson));
            }
            return collections;
        });
    }

    /**
     * Method to fetch items of a collection for navigation purposes. 
     *
     * @param collectionId
     *      The collection id of which its items are to be fetched.
     */
    fetchItems(collection): Observable<Array<Item>> {
        var params = new URLSearchParams();
        params.append("limit", collection.limit);
        params.append("offset", collection.offset);
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/collections/' + collection.id + '/items?expand=metadata'),
            search: params
        }).map(json => {
            let items = new Array<Item>();
            for(let itemJson of json) {
                items.push(new Item(itemJson));
            }
            return items;
        });
    }

    /**
     * Method to fetch details of a community. 
     *
     * @param id
     *      Community id of which to fetch its relationships and other details.
     */
    fetchCommunity(id): Observable<Community> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/communities/' + id + '?expand=parentCommunity,logo')
        }).map(json => {
            return new Community(json);
        });
    }

    /**
     * Method to fetch details of a collection. 
     *
     * @param id
     *      Collection id of which to fetch its relationships and other details.
     */
    fetchCollection(id): Observable<Collection> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/collections/' + id + '?expand=parentCommunity,logo')
        }).map(json => {
            return new Collection(json);
        });
    }

    /**
     * Method to fetch details of an item. 
     *
     * @param id
     *      Item id of which to fetch its relationships and other details.
     */
    fetchItem(id): Observable<Item> {
        return this.httpService.get({
            url: URLHelper.relativeToAbsoluteRESTURL('/items/' + id + '?expand=metadata,bitstreams,parentCollection')
        }).map(json => {
            return new Item(json);
        });
    }

    /**
     * Method to login and recieve a token. 
     *
     * @param email
     *      DSpace user email/login
     * @param password
     *      DSpace user password
     */
    login(email, password): Observable<Response> {
        console.log('login');
        console.log(email);
        console.log(password);
        return this.httpService.post({
            url: URLHelper.relativeToAbsoluteRESTURL('/login'),
            data: {
                email: email,
                password: password
            }
        }); 
    }

}
