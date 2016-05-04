import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response} from 'angular2/http';

import {Observable} from 'rxjs/Rx';

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
     * @param request
     *      an object, {uri: string, data: Object}, used to GET or POST
     */
    buildHeaders(request: any): Headers {
        let headers = new Headers();

        let headerArray = [
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' }
        ];

        if(request.headers) {
            headerArray = headerArray.concat(request.headers);
        }

        headerArray.forEach((header) => {
            headers.append(header.key, header.value);
        });

        return headers;
    }

    /**
     * Method to make a http POST request.
     *
     * @param request
     *      an object, {uri: string, data: Object, headers: Array}, used to POST
     */
    post(request: any): any {

        let body = JSON.stringify(request.data);

        let headers = this.buildHeaders(request);

        let options = new RequestOptions({ headers: headers });

        return this.http.post(request.url, body, options);
    }

    /**
     * Method to make http GET request. This method maps a serialized response
     * to a json object.
     *
     * @param request
     *      an object, {url: string, headers: Array}, used to GET
     */
    get(request: any): any {

        let headers = this.buildHeaders(request);

        let options = new RequestOptions({
            headers: headers,
            search: request.search
        });
        
        return this.http.get(request.url, options).map(response => {
            return response.json();
        });
    }

    upload(request: any, file: File, token: string): any {
        return Observable.create(observer => {
            let formData: FormData = new FormData();
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            formData.append("uploads[]", file, file.name);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open('POST', request.url, true);

            for(let header of request.headers) {
                xhr.setRequestHeader(header.key, header.value);
            }
            
            xhr.send(formData);
        });
    }

}
