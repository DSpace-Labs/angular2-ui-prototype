import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';

//import * as https from 'https';

// Angular 2
import 'angular2-universal-preview/polyfills';

import {expressEngine, REQUEST_URL, NODE_LOCATION_PROVIDERS, NODE_HTTP_PROVIDERS, NODE_PRELOAD_CACHE_HTTP_PROVIDERS } from 'angular2-universal-preview';
import {provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';


// App Component
import {AppComponent} from './app/app.component';

// Server Components
import {ServerAppComponent} from './server/html.component';
import {TitleComponent} from './server/title.component';

// App Injectables
import {DSpaceService} from './app/dspace/dspace.service';
import {HttpService} from './app/utils/http.service';
import {WebSocketService} from './app/utils/websocket.service';


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
        console.log('OPTIONS');
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
            DSpaceService,
            HttpService,
            WebSocketService
        ],
        async: true,
        preboot: true,
        precache: true,
    });

}


//app.get('/*', function (req, res) {
//    res.sendFile('/app/view/index.html', { "root": __dirname });
//});
//
//app.listen(PORT, function () {
//    console.log("Running at Port " + PORT);
//});


app.get('/', ngApp);
app.get('/dashboard', ngApp);
app.get('/home', ngApp);
app.get('/settings', ngApp);
app.get('/setup', ngApp);
app.get('/register', ngApp);
app.get('/login', ngApp);

app.get('/communities/**', ngApp);
app.get('/collections/**', ngApp);
app.get('/items/**', ngApp);


app.listen(PORT, () => {
    console.log('Started');
});


//https.createServer(options, app).listen(PORT, () => {
//    console.log('Started');
//});




