import 'angular2-universal-preview/polyfills';
import {prebootComplete} from 'angular2-universal-preview';

import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {enableProdMode} from 'angular2/core';

import {AppComponent} from './app.component';
import {DSpaceService} from './dspace/dspace.service';
import {BreadcrumbService} from './navigation/breadcrumb.service';
import {HttpService} from './utilities/http.service';
import {WebSocketService} from './utilities/websocket.service';

import {DSpaceDirectory} from './dspace/dspace.directory';
import {DSpaceCommunities} from './dspace/dspace.communities';
import {DSpaceCollections} from './dspace/dspace.collections';
import {DSpaceItems} from './dspace/dspace.items';

enableProdMode();

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    DSpaceService,
    DSpaceDirectory,
    DSpaceCommunities,
    DSpaceCollections,
    DSpaceItems,
    HttpService,
    WebSocketService,
    BreadcrumbService
])
.then(prebootComplete);