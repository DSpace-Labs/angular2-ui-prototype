# DSpaceUIAngular2Prototype

A DSpace UI Prototype using Angular2 deployed and developed using webpack. 

Intended to be isomorphic if client does not run JavaScript it will be rendered on the server.

Webpack is used to transpile Angular 2 Typescript into es5, packaging, run node server, and provide 'watch' development. 
The packaging consists of app, styles, and material. 

 - app is the typescript you write. 
 - styles are css you write. 
 - material will eventually be angular material.

# Requirements

 - Node
 
# Development

npm install

 - `npm run dep` Installs global dependencies.
 - `npm run build` Builds the project. Required when typescript is changed.
 - `npm run test` Runs node server and starts chrome in app mode with web security disabled.
 - `npm run watch` Builds, runs, and watches for changes to build again.
 
# Issues

 - CORS are not being handled correctly on the client side or they are not being provided from the REST API on the response.
 - Angular Universal in Beta.
 - angular-universal-preview node_http.js not using appropriate node server for https.
