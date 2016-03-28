# Angular 2 UI Prototype

This project represents the "extended prototype" featuring [Angular 2](https://angular.io/) from the [DSpace UI Prototype Challenge](https://wiki.duraspace.org/display/DSPACE/DSpace+UI+Prototype+Challenge). This prototype is a collaboration by @mire, CINECA, DuraSpace and Texas A&M.

The goal of this extended prototype is to evaluate the Angular 2 framework as a plausible DSpace UI platform. This includes evaluating whether it meets the SEO needs of Google Scholar.

**[Project Board (waffle.io)](https://waffle.io/DSpace-Labs/angular2-ui-prototype)**

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
 
## Getting Started

npm install

 - `npm install` Installs local dependencies.
 - `npm run dep` Installs [global dependencies](https://docs.npmjs.com/getting-started/installing-npm-packages-globally) (allowing them to be used from commandline)
 - `npm run build` Builds the project. *Required when typescript is changed.*
 - `npm run test` Runs node server and starts chrome in app mode with web security disabled. Visit http://localhost:3000/
 - `npm run watch` Builds, runs, and watches for changes to build again.
 
# Collaboration

**[Project Board (waffle.io)](https://waffle.io/DSpace-Labs/angular2-ui-prototype)**
* Project tasks are managed as GitHub issues using a [Waffle.io](https://github.com/waffleio/waffle.io) project board.
* Tasks can be moved between states via drag-and-drop on Project Board above (or manually using Github issue labels)
* More info on using Waffle.io at https://github.com/waffleio/waffle.io/wiki/FAQs

Other "best practices" to note:
* All code changes via PRs please (anyone can submit them)
* Have someone else approve/accept your PR (no self-approval unless it's a completely obvious bug fix)
* If you have a question or topic of discussion, consider adding it as a GitHub issue. That way we can track the final answer / decision (which will make it easier to document later on)

# Known Issues

 - Not currently a full implementation of DSpace. Currently this project is simply an Angular 2 UI against an existing DSpace REST API.
     - Currently expects DSpace 5.x REST API (not updated for 6.x)
     - Eventually needs to be packaged via Spring Boot alongside REST API and other server-side interfaces (OAI, SWORD, ect)
 - CORS are not being provided from the DSpace REST API in the response.
 - Angular2, Angular Universal, and rxjs are in Beta.
