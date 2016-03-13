import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

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

        //console.log('POST');
        //console.log(request);

        let body = JSON.stringify(request.data);
        
        let headers = this.buildHeaders([
            { key: 'Content-Type', value: 'application/json' },
            { key: 'Accept', value: 'application/json' }
        ]);

        let options = new RequestOptions({ headers: headers });

        let subscription = this.http
            .post(request.url, body, options)
            .map(response => response.text());
            
        subscription.subscribe(
                data => {
                    console.log(data);                    
                },
                err => {
                    console.log(err);
                },
                () => console.log('Complete')
        );

        return subscription;
    }

    get(request) {

        let headers = this.buildHeaders([
            { key: 'Content-Type', value: 'application/json' }
        ]);
        
        let options = new RequestOptions({ headers: headers });

        //console.log('GET');
        //console.log(request);

        let subscription = this.http
            .get(request.url, options)
            .map(response => response.text());

        subscription.subscribe(
                data => {
                    //console.log(JSON.parse(data));
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log('Finished');
                }
        );

        return subscription;
    }

}