# DSpaceUIAngular2Prototype

A DSpace UI Prototype using Angular2 deployed and developed using webpack. 

Intended to be used with prerender. http://prerender.io

Webpack is used to transpile Angular 2 Typescript into es5, packaging, run node server, and provide 'watch' development. 
The packaging consists of app, vendor, styles, and bootstrap. 

 - app is the typescript you write. 
 - vendor are all the dependent libraries. 
 - styles are css you write. 
 - bootstrap is the combination of jquery and bootstrap.

# Deployment

npm install

 - `npm run build` Builds the project. Required when typescript is changed.
 - `npm run test` Runs node server and starts chrome in app mode with web security disabled.
 - `npm run watch` Builds, runs, and watches for changes to build again.
 
# Issues

 - CORS are not being handled correctly on the client side or they are not being provided from the REST API on the response.
 - Prerender requires middleware service.
