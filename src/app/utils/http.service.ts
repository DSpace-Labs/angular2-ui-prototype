import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, Request, RequestMethod, Response} from 'angular2/http';

@Injectable()
export class HttpService {
    
    constructor(private http: Http) {

    }

    buildHeaders(hdrsArr) {
        let headers = new Headers();
        hdrsArr.forEach((header) => {
            headers.append(header.key, header.value);
        });
        return headers;
    }


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

    get(request) {
        console.log(request);

        let headers = this.buildHeaders([
            { key: 'Content-Type', value: 'text/plain' },
            { key: 'Accept', value: 'application/json' }
        ]);

        var options = new RequestOptions({
            method: RequestMethod.Get,
            url: request.url,
            headers: headers
        });
        
        return this.http.request(new Request(options)).map(response => {
            return response.json();
        });
        
        
        //return this.http.get(request.url, options).map(response => {
        //    return response.json();
        //});
    }

}