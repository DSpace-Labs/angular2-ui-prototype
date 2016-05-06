var webpackMerge = require('webpack-merge');
var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// Location of our modules
var node_modules = path.join(__dirname, 'node_modules');

// Default configuration
var defaultConfig = {
    // Our base directory is the same directory as this webpack.config.js (i.e. [src])
    context: __dirname,
    resolve: {
        // Directory that contains our modules is [src]/src
        root: path.join(__dirname, '/src')
    },
    // Static analysis linter for TypeScript advanced options configuration
    // Description: An extensible linter for the TypeScript language.
    //
    // See: https://github.com/wbuchwalter/tslint-loader
    module: {
        noParse: [
            path.join(__dirname, 'zone.js', 'dist'),
            path.join(__dirname, 'angular2', 'bundles')
        ],
        preLoaders: [
            {
                test: /\.ts$/,
                loader: "tslint-loader"
            }
        ]
    },
    tslint: {
      emitErrors: false,
      failOnHint: false,
      resourcePath: 'src'
    },
    output: {
        // Public path of any resources used by browser
        publicPath: path.resolve(__dirname),
        // Specifies the *default* name of the output file
        filename: 'bundle.js'
    }
}

// Common / shared configuration (shared between client and server side configs below)
var commonConfig = {
     // An array of extensions that should be used to resolve modules.
     // (These are the types of source files we have in our source code)
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        loaders: [
            // Typescript loader support for .ts (TypeScript files). Transpiles all TypeScript files into JS
            // See: https://github.com/TypeStrong/ts-loader
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    // Additional compiler plugins
    plugins: [
        // OccurenceOrderPlugin - varies the distribution of the ids to get the smallest id length
        // for often used ids
        // See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        // See: https://github.com/webpack/docs/wiki/optimization#minimize
        new webpack.optimize.OccurenceOrderPlugin(true)
    ]
};

// Client-side specific configuration. Builds our client-side JS app (app.bundle.js).
var clientConfig = {
    // Cache modules to improve performance (in builds)
    cache: true,
    // Entry point for this bundle (./src/app/main.ts)
    entry: "./src/app/main",
    output: {
        // The output build directory as absolute path (required).
        // Our final app is built into [src]/dist/
        path: path.join(__dirname, 'dist'),
        // Specifies the name of output file. This is our final compiled client-side app
        filename: 'app.bundle.js'
    },
    // Emit a "SourceMap". Makes it easier to debug the application, as
    // it will tell you exactly where an error is raised
    devtool: 'source-map',
    plugins: [
        // Copy i18n files (./resources/i18n/) into distribution's 'i18n' folder
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'resources', 'i18n'),
            to: 'i18n'
        }])
    ]
};

// Server-side configuration. Builds our server-side app (./dist/server/bundle.js)
var serverConfig = {
    // node = Compile for usage in a Node.js-like environment (i.e. server-side)
    target: 'node',
    // Entry point for the bundle. Selects a single directory
    entry: './src/server',
    output: {
        // The output directory as absolute path (required).
        // In this case [src]/dist/server
        path: path.join(__dirname, 'dist', 'server')
    },
    externals: checkNodeImport,
    node: {
        global: true,
        __dirname: true,
        __filename: true,
        process: true,
        Buffer: true
      },
      plugins: [
          // Copy specific files to final server build directory (./dist/server)
          // Anything copied into the "static" subfolder is then made available
          // off the '/static' URL path (see './src/server.ts'). So, these copy
          // statements make all our static resources available to server-side AND client-side
          new CopyWebpackPlugin([
            // Copy Bootstrap CSS into 'static/css' (from the bootstrap module)
            {
              from: path.join(node_modules, 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
              to: path.join('static', 'css', 'bootstrap.min.css')
            },
            // Copy Bootstrap CSS map into 'static/css' (from the bootstrap module)
            {
              from: path.join(node_modules, 'bootstrap', 'dist', 'css', 'bootstrap.min.css.map'),
              to: path.join('static', 'css', 'bootstrap.min.css.map')
            },
            // Copy Bootstrap Fonts into 'static/fonts' (from the bootstrap module)
            // NOTE: Bootstrap CSS references fonts as being at "../fonts/" (relative to CSS)
            {
              from: path.join(node_modules, 'bootstrap', 'dist', 'fonts'),
              to: path.join('static', 'fonts')
            },
            // Copy any json forms (./resources/forms/) into 'static/forms'
            {
              from: path.join(__dirname, 'resources', 'forms'),
              to: path.join('static', 'forms')
            },
            // Copy any CSS overrides (./resources/css/) into 'static/css' subfolder
            {
              from: path.join(__dirname, 'resources', 'css'),
              to: path.join('static', 'css')
            },
            // Copy any images (./resources/images/) into 'static/images' subfolder
            {
              from: path.join(__dirname, 'resources', 'images'),
              to: path.join('static', 'images')
            }
          ])
      ]
};


module.exports = [
    // Client app configs
    webpackMerge({}, defaultConfig, commonConfig, clientConfig),
    // Server app configs
    webpackMerge({}, defaultConfig, commonConfig, serverConfig)
];

// Helpers
function checkNodeImport(context, request, cb) {
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
        cb(null, 'commonjs ' + request); return;
    }
    cb();
}
