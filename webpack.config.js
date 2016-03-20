var webpackMerge = require('webpack-merge');
var webpack = require('webpack');
var path = require('path');


var defaultConfig = {
    module: {
        noParse: [
            path.join(__dirname, 'zone.js', 'dist'),
            path.join(__dirname, 'angular2', 'bundles')
        ]
    },
    context: __dirname,
    resolve: {
        root: path.join(__dirname, '/src')
    },
    output: {
        publicPath: path.resolve(__dirname),
        filename: 'bundle.js'
    }
}


var commonConfig = {
    resolve: {
        extensions: ['', '.css', '.scss', '.js', '.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/, 
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true)
    ]
};


var clientConfig = {
    cache: true,
    entry: {
        "app": "./src/app/boot",
        "styles": [
            "./resources/styles/main.scss"
        ],
        "material": []
    },
    output: {
        path: __dirname,
        filename: "./dist/[name].bundle.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [            
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    }
};

var serverConfig = {
    target: 'node',
    entry: './src/server',
    output: {
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
    // Client
    webpackMerge({}, defaultConfig, commonConfig, clientConfig),
    // Server
    webpackMerge({}, defaultConfig, commonConfig, serverConfig)
];

// Helpers
function checkNodeImport(context, request, cb) {
    if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
        cb(null, 'commonjs ' + request); return;
    }
    cb();
}