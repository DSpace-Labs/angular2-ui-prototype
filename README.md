# Angular 2 UI Prototype

This project represents the "extended prototype" featuring [Angular 2](https://angular.io/) from the [DSpace UI Prototype Challenge](https://wiki.duraspace.org/display/DSPACE/DSpace+UI+Prototype+Challenge). This prototype is a collaboration by @mire, CINECA, DuraSpace and Texas A&M.

The goal of this extended prototype is to evaluate the Angular 2 framework as a plausible DSpace UI platform. This includes evaluating whether it meets the SEO needs of Google Scholar.

## Implementation Details

Initial implementation / project structure is based on wwelling's proof-of-concept at: https://github.com/wellingWilliam/AngularUniversalDSpaceUIPrototype

This is a prototype of Angular 2 + Angular Universal (isomorphic javascript for Angular 2). Angular Universal performs the server side rendering, which we hope will accommodate SEO requirments of Google Scholar.

[Webpack](https://www.npmjs.com/package/webpack) is used to transpile Angular 2 Typescript into es5, package bundles, run node server, and provide 'watch' development. 

The packaging consists of app, styles, and bootstrap. 

 - `src/app/` is the typescript that drives application
 - `resources/styles/` is css you write. 
 - Also uses bootstrap with jQuery plugin

## Requirements

 - [Node.js](https://nodejs.org/)
 - (Optional) An external DSpace 5.x site. At this time, the prototype simply points at https://training-ir.tdl.org/
     - REST API location can be changed in [dspace.service.ts](https://github.com/DSpace-Labs/angular2-ui-prototype/blob/master/src/app/dspace/dspace.service.ts)
 
# Development

npm install

 - `npm run dep` Installs global dependencies.
 - `npm run build` Builds the project. Required when typescript is changed.
 - `npm run test` Runs node server and starts chrome in app mode with web security disabled.
 - `npm run watch` Builds, runs, and watches for changes to build again.
 
# Known Issues

 - Not currently a full implementation of DSpace. Currently this project is simply an Angular 2 UI against an existing DSpace REST API.
     - Currently expects DSpace 5.x REST API (not updated for 6.x)
     - Eventually needs to be packaged via Spring Boot alongside REST API and other server-side interfaces (OAI, SWORD, ect)
 - CORS are not being provided from the DSpace REST API in the response.
 - Angular2, Angular Universal, and rxjs are in Beta.
