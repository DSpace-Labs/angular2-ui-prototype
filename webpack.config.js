var webpackMerge = require('webpack-merge');
var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// Default configuration
var defaultConfig = {
    module: {
        // Do not parse these directories for source modules/files
        noParse: [
            path.join(__dirname, 'zone.js', 'dist'),
            path.join(__dirname, 'angular2', 'bundles')
        ]
    },
    // Our base directory is the same directory as this webpack.config.js (i.e. [src])
    context: __dirname,
    resolve: {
        // Directory that contains our modules is [src]/src
        root: path.join(__dirname, '/src')
    },
    output: {
        // Public path of any resources used by browser
        publicPath: path.resolve(__dirname),
        // Specifies the name of each output file on disk.
        filename: 'bundle.js'
    }
}

// Common / shared configuration (shared between client and server side configs below)
var commonConfig = {
     // An array of extensions that should be used to resolve modules.
     // (These are the types of source files we have in our source code)
    resolve: {
        extensions: ['', '.css', '.scss', '.js', '.ts']
    },
    module: {
        loaders: [
          // Typescript loader support for .ts (TypeScript files). Processes all TypeScript files
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
        new webpack.optimize.OccurenceOrderPlugin(true),
        // Tell WebPack to prepend `var $ = require("jquery")` whenever it
        // encounters the global $ identifier. See: http://stackoverflow.com/a/28989476/3750035
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" })
    ]
};

// Client-side specific configuration. Builds all client-side code.
var clientConfig = {
    // Cache modules to improve performance (in builds)
    cache: true,
    // Entry point for the bundle (i.e. directory or files).
    // This creates multiple entries of different names: 'app', 'styles', 'bootstrap'
    entry: {
        "app": "./src/app/boot",
        "styles": [
            "./resources/styles/main.scss"
        ],
        "bootstrap": [
            "bootstrap-sass!./resources/bootstrap-sass.config.js"
        ]
    },
    output: {
        // The output directory as absolute path (required).
        path: __dirname,
        // Specifies the name of each output file on disk.
        // [name] references the name ofthe "entry" point (see 'entry' above)
        filename: "./dist/[name].bundle.js"
    },
    // Emit a "SourceMap". Makes it easier to debug the application, as
    // it will tell you exactly where an error is raised
    devtool: 'source-map',
    module: {
        loaders: [
            {
                // Process all .scss files using the
                // style-loader, css-loader and sass-loader
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                // Ensures all Bootstrap JS files have access to the jQuery object
                test: /bootstrap\/js\//,
                loader: 'imports?jQuery=jquery'
            },
            {
                // Ensure all Boostrap image/fonts are available via url-loader
                // This essentially just copies these assets to URLs in output
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'resources', 'i18n'),
            to: path.join(__dirname, 'dist', 'i18n')
        }])
    ]
};

// Server-side configuration. Builds all server-side code.
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
    }
};


module.exports = [
    // Client configs
    webpackMerge({}, defaultConfig, commonConfig, clientConfig),
    // Server configs
    webpackMerge({}, defaultConfig, commonConfig, serverConfig)
];

// Helpers
function checkNodeImport(context, request, cb) {
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
        cb(null, 'commonjs ' + request); return;
    }
    cb();
}
