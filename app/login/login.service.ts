import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

import {DSpaceService} from '../dspace/dspace.service';
import {HttpService} from '../utils/http.service';

@Injectable()
export class LoginService {

    emitter: EventEmitter<boolean>;

    constructor(private httpService: HttpService, private dSpaceService: DSpaceService) {
        this.emitter = new EventEmitter<boolean>();
    }

    show() {
        this.emitter.next(true);
    }

    login(email, password) {
        this.httpService.post({
            url: this.dSpaceService.getUrl() + '/login',
            data: {
                email: email,
                password: password
            }
        });        
    }

}