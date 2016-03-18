import * as path from 'path';
import * as express from 'express';


// Angular 2
import 'angular2-universal-preview/polyfills';

import {expressEngine, REQUEST_URL, NODE_LOCATION_PROVIDERS, NODE_HTTP_PROVIDERS} from 'angular2-universal-preview';
import {provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';

// Application
import {AppComponent} from './app/app.component';
import {DSpaceService} from './app/dspace/dspace.service';
import {HttpService} from './app/utils/http.service';
import {WebSocketService} from './app/utils/websocket.service';

// Serverside
import {TitleComponent} from './server/title.component';

var httpPort = 3001;
var prerenderPort = 3000;

let app = express();
let root = path.join(path.resolve(__dirname, '..'));

enableProdMode();

// Express View
app.engine('.html', expressEngine);
app.set('views', __dirname + '/app/view');
app.set('view engine', 'html');


function ngApp(req, res) {
    let baseUrl = '/';
    let url = req.originalUrl || '/';
    res.render('index', {
        directives: [AppComponent, TitleComponent],
        providers: [
            provide(APP_BASE_HREF, { useValue: baseUrl }),
            provide(REQUEST_URL, { useValue: url }),
            ROUTER_PROVIDERS,
            NODE_LOCATION_PROVIDERS,
            NODE_HTTP_PROVIDERS,
            DSpaceService,
            HttpService,
            WebSocketService
        ],
        preboot: true
    });
}

app.use(express.static(root));

app.get('/**', ngApp);

app.listen(httpPort, () => {
    console.log("Running at Port " + httpPort);
    console.log("Prerender at Port " + prerenderPort);
});