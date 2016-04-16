import * as path from 'path';
import * as express from 'express';

import 'angular2-universal/polyfills';

import {
    expressEngine,
    REQUEST_URL,
    NODE_LOCATION_PROVIDERS,
    NODE_HTTP_PROVIDERS,
    NODE_PRELOAD_CACHE_HTTP_PROVIDERS
} from 'angular2-universal';

import {
    provide,
    enableProdMode
} from 'angular2/core';

import {
    APP_BASE_HREF,
    ROUTER_PROVIDERS
} from 'angular2/router';

import {TranslateService, TranslateLoader} from "ng2-translate/ng2-translate";

// App Component
import {AppComponent} from './app/app.component';

// Server Components
import {TitleComponent} from './server/title.component';

// App Injectables
import {BreadcrumbService} from './app/navigation/services/breadcrumb.service';
import {PaginationService} from './app/navigation/services/pagination.service';
import {DSpaceDirectory} from './app/dspace/dspace.directory';
import {DSpaceConstants} from './app/dspace/dspace.constants';
import {DSpaceService} from './app/dspace/dspace.service';
import {DSpaceStore} from './app/dspace/dspace.store';
import {HttpService} from './app/utilities/http.service';
import {FileSystemLoader} from "./server/i18n/filesystem.translateloader";
import {MetaTagService} from "./app/utilities/meta-tag/meta-tag.service";

// Disable Angular 2's "development mode".
// See: https://angular.io/docs/ts/latest/api/core/enableProdMode-function.html
enableProdMode();

// Default to port 3000
var PORT = 3000;

// Create our server-side app with express (http://expressjs.com/)
// See also http://expressjs.com/en/4x/api.html#express
let app = express();

// Root directory of our app is the top level directory (i.e. [src])
let root = path.join(path.resolve(__dirname, '..'));

// Create an express "middleware" function which embeds CORS headers (http://enable-cors.org/)
// into any response we receive.
// TODO: Once DSpace's REST API returns CORS headers, this can be removed.
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-HTTP-Method-Override, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
// Enable the above function in our express app
app.use(allowCrossDomain);

// Express view engine setup
// Use the "expressEngine" from Angular Universal for all HTML files,
// and configure it
app.engine('.html', expressEngine);
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');

// Define location of Static Resources
// Map the /static URL path to the ./dist/server/static local directory
app.use('/static', express.static(path.join(root, 'dist', 'server', 'static'), {index:false}));
// Other static resources (e.g. our compiled app.bundle.js) can be found directly in ./dist
app.use(express.static(path.join(root, 'dist'), {index:false}));

// Port to use
app.set('port', PORT);

/**
 * Server-side Angular App setup
 * This defines all components which should be initialized on server-side
 * along with all necessary application data providers (e.g. services, etc).
 * (This function is similar in nature to the "bootstrap()" function called in our
 * `boot.ts` to initialize the client-side app.)
 **/
function ngApp(req, res) {
    let baseUrl = '/';
    let url = req.originalUrl || '/';
    console.log('url: ' + url);
    res.render('index', {
        directives: [AppComponent, TitleComponent],
        providers: [
            provide(APP_BASE_HREF, { useValue: baseUrl }),
            provide(REQUEST_URL, { useValue: url }),
            ROUTER_PROVIDERS,
            NODE_LOCATION_PROVIDERS,
            NODE_PRELOAD_CACHE_HTTP_PROVIDERS,
            provide(TranslateLoader, {
                useFactory: () => new FileSystemLoader(path.join(root, 'dist', 'i18n'), '.json')
            }),
            TranslateService,
            BreadcrumbService,
            PaginationService,
            DSpaceDirectory,
            DSpaceConstants,
            DSpaceService,
            DSpaceStore,
            HttpService,
            MetaTagService
        ],
        preboot: {
            replay: 'hydrate',
            appRoot: 'dspace',
            //listen: any,
            //freeze: any,
            //pauseEvent: string,
            //resumeEvent: string,
            //completeEvent: string,
            //presets: any,
            uglify: true,
            buffer: true,
            debug: false
        },
        async: true
    });
}

// Specifies that all server-side paths should be routed to our ngApp function (see above)
app.get('/*', ngApp);

// Binds our express app the the specified port (i.e. starts it up) and logs when it is running
app.listen(PORT, () => {
    console.log("Running at port " + PORT);
});
