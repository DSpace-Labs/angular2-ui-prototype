# Angular 2 UI Prototype

This project represents the "extended prototype" featuring [Angular 2](https://angular.io/) from the [DSpace UI Prototype Challenge](https://wiki.duraspace.org/display/DSPACE/DSpace+UI+Prototype+Challenge). This prototype is a collaboration by @mire, CINECA, DuraSpace and Texas A&M.

The goal of this extended prototype is to evaluate the Angular 2 framework as a plausible DSpace UI platform. This includes evaluating whether it meets the SEO needs of Google Scholar.

**[Project Board (waffle.io)](https://waffle.io/DSpace-Labs/angular2-ui-prototype)**

## Implementation Phases

### Phase 1 : Initial Google Scholar Proof-of-Concept

In Phase 1 of this UI Prototype, we will be rapidly developing a basic Angular 2 UI using Angular Universal (isomorphic Javascript for Angular 2). The purpose of the initial prototype is to simply prove (or disprove) that Angular Universal's server-side rendering capabilities will meet the SEO needs of Google Scholar.

In Phase 1, all development will occur using Node / NPM (these are akin to Maven or Gradle for Java). This will allow us to rapidly build a simple Angular 2 UI against an existing REST API (e.g. http://demo.dspace.org). That simple Angular 2 UI can then be tested by Google Scholar to see if it will meet their SEO needs.

After this phase is complete, we'd simply have a prototype Angular 2 UI that can be installed via Node and pointed at an existing DSpace installation's REST API.

### Phase 2 : Migrate UI into Spring Boot / DSpace

Assuming that Phase 1 proves that Angular 2 meets our SEO needs, we will then work to migrate the prototype Angular 2 UI into Spring Boot (alongside the DSpace Java API, REST API, etc). This will involve migrating the existing Angular2 Node / NPM build process into either Maven (or Gradle), using an available Node plugin for those build tools.

After this phase is complete, we'd have an Angular 2 UI that is provided as part of the normal DSpace installation process.

(NOTE: If for some reason, Phase 1 shows that Angular 2 will NOT meet our SEO needs, then this project will end at Phase 1.)


## Requirements

 - [Node.js](https://nodejs.org/)
 - (Optional) An external DSpace 5.x site. At this time, the prototype simply points at the REST API for http://demo.dspace.org
     - REST API location can be changed in `package.json` (see the "watch" and "test" commands under `scripts`).

## Getting Started

Here's how you can install the current prototype:

 - `npm install` Installs local dependencies.
 - `npm run global` Installs [global dependencies](https://docs.npmjs.com/getting-started/installing-npm-packages-globally) (allowing them to be used from command line)
 - `npm run docs` Generates the TypeDoc documentation in the docs directory. *Should be run and update to gh-pages when typescript is changed.*
 - `npm run build` Builds the project. *Required when typescript is changed.*
 - `npm run watch` Builds, runs, and watches for changes to build again. Visit http://localhost:3000/
     - Alternatively, `npm run test` Runs node server and a proxy to work around cors and security issues of DSpace REST API. Visit http://localhost:3000/

     ## Implementation Details

     Overview of all the parts of the UI prototype:
     * The UI itself is built using [Typescript](http://www.typescriptlang.org/) (See `*.ts` files under `src`). Typescript (built by Microsoft) is "typed superset of Javascript that compiles to plain Javascript". It is the recommended language to use with Angular 2, see the [5 min Quickstart](https://angular.io/docs/ts/latest/quickstart.html)
         * Our Angular 2 [Typescript configuration file](https://angular.io/docs/ts/latest/guide/typescript-configuration.html) is at [`tsconfig.json`](https://github.com/DSpace-Labs/angular2-ui-prototype/blob/master/tsconfig.json)
     * [Webpack](https://webpack.github.io/docs/configuration.html) is used to transpile Angular 2 Typescript into es5 ([ECMAScript 5, the official standard behind Javascript](http://benmccormick.org/2015/09/14/es5-es6-es2016-es-next-whats-going-on-with-javascript-versioning/)), package bundles, run node server, and provide 'watch' development.
         * Our [Webpack configuration](https://webpack.github.io/docs/configuration.html) is at [`webpack.config.js`](https://github.com/DSpace-Labs/angular2-ui-prototype/blob/master/webpack.config.js)
     * [Typings](https://github.com/typings/typings) is used to manage/install Typescript definitions
         * Here's a good explanation as to why Typings is useful and how it lets you pull in external module Typescript definitions: https://github.com/typings/typings/blob/master/docs/external-modules.md
         * Our Typings config file is at [`typings.json`](https://github.com/DSpace-Labs/angular2-ui-prototype/blob/master/typings.json)
         * We also have to provide custom Typescript definitions for modules that don't provide it. Those are at: [`src/typings.d.ts`](https://github.com/DSpace-Labs/angular2-ui-prototype/blob/master/src/typings.d.ts)
     * [NPM (Node Package Manager)](https://www.npmjs.com/) is used to build/run the project (see below)
         * Our [NPM configuration](https://docs.npmjs.com/files/package.json) is at [`package.json`](https://github.com/DSpace-Labs/angular2-ui-prototype/blob/master/package.json)
     * [nodemon](http://nodemon.io/) is used to automatically restart the server when source code changes.
         * Our [nodemon configuration](https://github.com/remy/nodemon#config-files) is at [`nodemon.json`](https://github.com/DSpace-Labs/angular2-ui-prototype/blob/master/nodemon.json)

     Here's where various parts of the codebase are located:
      - `src/app/` is the client-side typescript that drives application
      - `src/server/` is the server-side typescript components
      - `resources/` is where all static resources (CSS, images, etc) are kept
      - [Bootstrap](http://getbootstrap.com/) is pulled in dynamically via NPM

# Collaboration

**[Project Board (waffle.io)](https://waffle.io/DSpace-Labs/angular2-ui-prototype)**
* Project tasks are managed as GitHub issues using a [Waffle.io](https://github.com/waffleio/waffle.io) project board.
* Tasks can be moved between states via drag-and-drop on Project Board above (or manually using Github issue labels)
* More info on using Waffle.io at https://github.com/waffleio/waffle.io/wiki/FAQs

Other "best practices" to note:
* **Style guide**: Currently, we are loosely following the style guide at http://mgechev.github.io/angular2-style-guide/
* **All code changes via PRs please** (anyone can submit them). Please write a detailed description of the changes.
* **Have someone else approve/accept your PR** (no self-approval unless it's a completely obvious bug fix).
* **Code comments are *highly recommended*.** We are all learning Angular 2, and it may not be obvious what your code changes are actually doing. So, please add code comments.
* **Hints / tips / resources.** We are gathering information on developer hints/tips/resources on our [GitHub project Wiki](https://github.com/DSpace-Labs/angular2-ui-prototype/wiki)
* If you have a question or topic of discussion, consider adding it as a GitHub issue. That way we can track the final answer / decision (which will make it easier to document later on)

# Known Issues

 - Not currently a full implementation of DSpace. Currently this project is simply an Angular 2 UI against an existing DSpace REST API.
     - Currently expects DSpace 5.x REST API (not updated for 6.x)
     - Eventually needs to be packaged via Spring Boot alongside REST API and other server-side interfaces (OAI, SWORD, ect)
 - Requires proxy to work around security issues: invalid certificates and absent CORS headers.
 - CORS are not being provided from the DSpace REST API in the response.
 - Angular2, Angular Universal, and rxjs are in Beta.
