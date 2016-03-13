'use strict';

var webpack = require("webpack");
var path = require('path');

module.exports = {
    cache: true,
    entry: {
        "vendor": "./app/vendor",
        "app": "./app/boot",
        "styles": [
            "./resources/styles/main.scss"
        ],
        "bootstrap": [
            "bootstrap-sass!./resources/bootstrap-sass.config.js"
        ]
    },
    output: {
        path: __dirname,
        filename: "./dist/[name].bundle.js"
    },
    resolve: {        
        extensions: ['', '.css', '.scss', '.webpack.js', '.web.js', '.js', '.ts']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.ts/,
                loaders: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /bootstrap\/js\//, 
                loader: 'imports?jQuery=jquery'
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "./dist/vendor.bundle.js"),
        new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" })
    ]
}