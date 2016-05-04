import 'angular2-universal/polyfills';
import {prebootComplete} from 'angular2-universal';
import {bootstrap} from 'angular2/platform/browser';
import {enableProdMode, provide} from 'angular2/core';
import {FORM_PROVIDERS} from 'angular2/common';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {
    TranslateLoader,
    TranslateStaticLoader, TranslateService
} from "ng2-translate/ng2-translate";

import {AppComponent} from './app.component';
import {DSpaceService} from './dspace/services/dspace.service';
import {AuthorizationService} from './dspace/authorization/services/authorization.service';
import {BreadcrumbService} from './navigation/services/breadcrumb.service';
import {PaginationService} from './navigation/services/pagination.service';
import {HttpService} from './utilities/services/http.service';
import {MetaTagService} from "./utilities/meta-tag/meta-tag.service";
import {StorageService} from './utilities/services/storage.service';
import {PagingStoreService} from './dspace/services/paging-store.service';
import {ContextProviderService} from './dspace/services/context-provider.service';
import {DSpaceDirectory} from './dspace/dspace.directory';
import {DSpaceConstants} from './dspace/dspace.constants';
import {MetadataHelper} from './utilities/metadata.helper';
import {GoogleScholarMetadataService} from './utilities/services/google-scholar-metadata.service.ts';

// Disable Angular 2's "development mode".
// See: https://angular.io/docs/ts/latest/api/core/enableProdMode-function.html
enableProdMode();

/**
* "Bootstrap" the client-side application (i.e. start it up), by directly calling
* the Angular 2 bootstrap() function with our main application component (AppComponent).
* See: https://angular.io/docs/ts/latest/api/platform/browser/bootstrap-function.html
*
* This also initializes all our application's data providers (e.g. services, etc)
* by passing them to the main component. For more on providers/injection, see this blog post:
* http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html
**/
bootstrap(AppComponent, [
    FORM_PROVIDERS,
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
        deps: [Http]
    }),
    AuthorizationService,
    BreadcrumbService,
    ContextProviderService,
    DSpaceConstants,
    DSpaceDirectory,
    DSpaceService,
    GoogleScholarMetadataService,
    HttpService,
    MetadataHelper,
    MetaTagService,
    PaginationService,
    PagingStoreService,
    StorageService,
    TranslateService
])
.then(prebootComplete);
