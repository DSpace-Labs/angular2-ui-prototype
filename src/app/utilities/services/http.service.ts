import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response} from 'angular2/http';

/**
 * Injectable service to be used to make xhr requests. Basic functionality.
 */
@Injectable()
export class HttpService {
    
    /**
     * @param http
     *      Http is an Angular2 service for making xhr requests.
     */
    constructor(private http: Http) {}

    /**
     * Convinience method to instantiate and assign headers.
     *
     * @param hdrsArr
     *      an array of objects, {key: string, value: string}, containing headers
     */
    buildHeaders(hdrsArr) {
        let headers = new Headers();
        hdrsArr.forEach((header) => {
            headers.append(header.key, header.value);
        });
        return headers;
    }

    /**
     * Method to make a http POST request.
     *
     * @param request
     *      an object, {uri: string, data: Object}, used to POST
     */
    post(request) {
        //console.log(request)

        let body = JSON.stringify(request.data);
        
        let headers = this.buildHeaders([
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' }
        ]);

        let options = new RequestOptions({ headers: headers });

        return this.http.post(request.url, body, options);
    }

    /**
     * Method to make http GET request. This method maps a serialized response
     * to a json object.
     *
     * @param request
     *      an object, {url: string}, used to GET
     */
    get(request) {
        //console.log(request);

        let headers = this.buildHeaders([
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' }
        ]);

        let options = new RequestOptions({
            method: RequestMethod.Get,
            url: request.url,
            headers: headers,
            search: request.search
        });
        
        return this.http.request(new Request(options)).map(response => {
            return response.json();
        });
    }

}
