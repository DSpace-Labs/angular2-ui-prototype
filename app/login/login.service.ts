import {Injectable} from 'angular2/core';
import {EventEmitter} from 'angular2/core';

import {DSpaceService} from '../dspace/dspace.service';

@Injectable()
export class LoginService {

    emitter: EventEmitter<boolean>;

    constructor(private dspaceService: DSpaceService) {
        this.emitter = new EventEmitter<boolean>();
    }

    show() {
        this.emitter.next(true);
    }

    login(email, password) {
        this.dspaceService.login(email, password);
    }

}