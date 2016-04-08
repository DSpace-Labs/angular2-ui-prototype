import * as path from 'path';
import * as express from 'express';
//import * as https from 'https';

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
import {BreadcrumbService} from './app/navigation/breadcrumb.service';
import {DSpaceDirectory} from './app/dspace/dspace.directory';
import {DSpaceKeys} from './app/dspace/dspace.keys';
import {DSpaceService} from './app/dspace/dspace.service';
import {DSpaceStore} from './app/dspace/dspace.store';
import {HttpService} from './app/utilities/http.service';
import {FileSystemLoader} from "./server/i18n/filesystem.translateloader";

enableProdMode();


var PORT = 3000;

let app = express();

let root = path.join(path.resolve(__dirname, '..'));


//var options = {
//    key: fs.readFileSync('./ssl/key.pem'),
//    ca: fs.readFileSync('./ssl/csr.pem'),
//    cert: fs.readFileSync('./ssl/cert.pem'),
//    requestCert: true,
//    rejectUnauthorized: false
//};
//
//require('ssl-root-cas/latest').inject().addFile('./ssl/dspace-cert.pem');



var allowCrossDomain = function (req, res, next) {
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

app.use(allowCrossDomain);

// Express View
app.engine('.html', expressEngine);
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');

// Static Resources
app.use(express.static(root, { index: false }));

// Port
app.set('port', PORT);

// Serverside Angular
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
                useFactory: () => new FileSystemLoader(path.join(root, 'dist' ,'i18n'), '.json')
            }),
            TranslateService,
            BreadcrumbService,
            DSpaceDirectory,
            DSpaceKeys,
            DSpaceService,
            DSpaceStore,
            HttpService
        ],
        preboot: {
            //listen: any,
            replay: 'hydrate',
            //freeze: any,
            appRoot: 'dspace',
            //pauseEvent: string,
            //resumeEvent: string,
            //completeEvent: string,
            //presets: any,
            uglify: true,
            buffer: true,
            debug: false
        },
        async: true,
        precache: true
    });
}


//app.get('/*', function (req, res) {
//    res.sendFile('/app/view/index.html', { "root": __dirname });
//});
//
//app.listen(PORT, function () {
//    console.log("Running at port " + PORT);
//});



app.get('/*', ngApp);

app.listen(PORT, () => {
    console.log("Running at port " + PORT);
});


//https.createServer(options, app).listen(PORT, () => {
//    console.log("Running at port " + PORT);
//});
