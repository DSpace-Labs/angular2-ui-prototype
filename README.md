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

npm run build - builds the project. required when typescript is changed.
npm run test - runs node server and starts chrome in app mode with web security disabled
npm run watch - builds, runs, and watches for changes and builds again

# Issues

CORS are not being handled correctly on the client side or they are not being provided from the REST API on the response.
Prerender requires middleware service.
