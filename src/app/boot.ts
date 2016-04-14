import 'angular2-universal/polyfills';
import {prebootComplete} from 'angular2-universal';

import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {ROUTER_PROVIDERS, Location} from 'angular2/router';
import {enableProdMode, provide} from 'angular2/core';

import {
    TranslateLoader,
    TranslateStaticLoader, TranslateService
} from "ng2-translate/ng2-translate";

import {AppComponent} from './app.component';
import {DSpaceService} from './dspace/dspace.service';
import {BreadcrumbService} from './navigation/breadcrumb.service';
import {PaginationService} from './navigation/pagination.service';
import {HttpService} from './utilities/http.service';
import {MetaTagService} from "./utilities/meta-tag/meta-tag.service";

import {DSpaceDirectory} from './dspace/dspace.directory';
import {DSpaceStore} from './dspace/dspace.store';
import {DSpaceConstants} from './dspace/dspace.constants';

enableProdMode();

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    Location,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'dist/i18n', '.json'),
        deps: [Http]
    }),
    TranslateService,
    BreadcrumbService,
    PaginationService,
    DSpaceDirectory,
    DSpaceConstants,
    DSpaceService,
    DSpaceStore,
    HttpService,
    MetaTagService,
])
.then(prebootComplete);
