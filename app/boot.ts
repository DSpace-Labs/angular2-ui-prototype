import {bootstrap}    from 'angular2/platform/browser';

import {provide} from 'angular2/core';

import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {AppComponent} from './app.component';

import {DSpaceService} from './dspace/dspace.service';
import {BreadcrumbService} from './dspace/breadcrumb.service';

import {HttpService} from './utils/http.service';
import {WebSocketService} from './utils/websocket.service';

import {enableProdMode} from 'angular2/core';

enableProdMode();

bootstrap(AppComponent, [
    //provide(Window, { useValue: window }),
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    DSpaceService,
    BreadcrumbService,
    HttpService,
    WebSocketService
]);