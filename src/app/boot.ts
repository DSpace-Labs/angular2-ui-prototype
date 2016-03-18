import 'angular2-universal-preview/polyfills';
import {prebootComplete} from 'angular2-universal-preview';

import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {enableProdMode} from 'angular2/core';

import {AppComponent} from './app.component';
import {DSpaceService} from './dspace/dspace.service';
import {HttpService} from './utils/http.service';
import {WebSocketService} from './utils/websocket.service';

enableProdMode();

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    DSpaceService,
    HttpService,
    WebSocketService
])
.then(prebootComplete);