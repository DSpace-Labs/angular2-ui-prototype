import 'angular2-universal/polyfills';

import {
    bootstrap,
    enableProdMode,
    prebootComplete,
    BROWSER_ROUTER_PROVIDERS,
    BROWSER_HTTP_PROVIDERS
} from 'angular2-universal';

import { Http } from '@angular/http';

import { provide } from '@angular/core';

import {
    TranslateLoader,
    TranslateStaticLoader,
    TranslateService
} from "ng2-translate/ng2-translate";

import { AppComponent } from './app.component';
import { AuthorizationService } from './dspace/authorization/services/authorization.service';
import { BreadcrumbService } from './navigation/services/breadcrumb.service';
import { ContextProviderService } from './dspace/services/context-provider.service';
import { DSpaceConstantsService } from './dspace/services/dspace-constants.service';
import { DSpaceHierarchyService } from './dspace/services/dspace-hierarchy.service';
import { DSpaceService } from './dspace/services/dspace.service';
import { FormService } from './utilities/form/form.service';
import { GoogleScholarMetadataService } from './utilities/services/google-scholar-metadata.service.ts';
import { HttpService } from './utilities/services/http.service';
import { MetadataHelper } from './utilities/metadata.helper';
import { MetaTagService } from "./utilities/meta-tag/meta-tag.service";
import { NotificationService } from './utilities/notification/notification.service';
import { PaginationService } from './navigation/services/pagination.service';
import { PagingStoreService } from './dspace/services/paging-store.service';
import { StorageService } from './utilities/services/storage.service';
import { SidebarService } from './utilities/services/sidebar.service';
import { ViewportService } from "./utilities/services/viewport.service";

import { AppSidebarHelper } from './utilities/app-sidebar.helper';
import { CollectionSidebarHelper } from "./utilities/collection-sidebar.helper";
import { CommunitySidebarHelper } from "./utilities/community-sidebar.helper";
import { HomeSidebarHelper } from "./utilities/home-sidebar.helper.ts";
import { ItemSidebarHelper } from "./utilities/item-sidebar.helper";

import {CollapseDirective} from "ng2-bootstrap/ng2-bootstrap";

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
    ...BROWSER_ROUTER_PROVIDERS,
    ...BROWSER_HTTP_PROVIDERS,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
        deps: [ Http ]
    }),
    AuthorizationService,
    BreadcrumbService,
    ContextProviderService,
    DSpaceConstantsService,
    DSpaceHierarchyService,
    DSpaceService,
    FormService,
    GoogleScholarMetadataService,
    HttpService,
    MetadataHelper,
    MetaTagService,
    NotificationService,
    PaginationService,
    PagingStoreService,
    StorageService,
    TranslateService,
    SidebarService,
    ViewportService,
    AppSidebarHelper,
    CollectionSidebarHelper,
    CommunitySidebarHelper,
    HomeSidebarHelper,
    ItemSidebarHelper
]).then(prebootComplete);
