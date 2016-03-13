import {bootstrap}    from 'angular2/platform/browser';

import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {AppComponent} from './app.component';

import {DSpaceService} from './dspace/dspace.service';
import {BreadcrumbService} from './dspace/breadcrumb.service';

import {HttpService} from './utils/http.service';
import {WebSocketService} from './utils/websocket.service';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    DSpaceService,
    BreadcrumbService,
    HttpService,
    WebSocketService
]);