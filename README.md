# AngularUniversalDSpaceUIPrototype

An Angular Universal DSpace UI Prototype. The server side rendering will accommodate SEO requirments of Google Scholar.

Webpack is used to transpile Angular 2 Typescript into es5, package bundles, run node server, and provide 'watch' development. 
The packaging consists of app, styles, and bootstrap. 

 - app is the typescript you write. 
 - styles are css you write. 
 - bootstrap with jQuery plugin.

# Requirements

 - Node.js
 
# Development

npm install

 - `npm run dep` Installs global dependencies.
 - `npm run build` Builds the project. Required when typescript is changed.
 - `npm run test` Runs node server and starts chrome in app mode with web security disabled.
 - `npm run watch` Builds, runs, and watches for changes to build again.
 
# Issues

 - CORS are not being provided from the DSpace REST API in the response.
 - Angular2, Angular Universal, and rxjs are in Beta.
