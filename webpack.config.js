var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var debug = process.env.NODE_ENV !== "production";

var APP_DIR = path.resolve(__dirname, 'src/client');
var DIST_DIR = path.resolve(__dirname, 'dist');

var SERVER_DIR = path.resolve(__dirname, 'src/server');
var BUILD_DIR = path.resolve(__dirname, 'build');


var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

var config = [
    {
        name: 'client',
        entry: APP_DIR + '/index.js',
        output: {
            path: DIST_DIR,
            filename: 'bundle.js',
            publicPath: '/'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        "presets": ["react", "es2015", "stage-0"],
                        // plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                    }
                },
            ]
        },
        plugins: debug ? [
            new HtmlWebpackPlugin({
                template: APP_DIR + '/index.template.ejs',
                inject: 'body'
            })
        ] : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
        ],
        devtool: debug ? "inline-sourcemap" : null,
    },
    // {
    //     name: 'server',
    //     entry: SERVER_DIR + '/server.js',
    //     target: 'node',
    //     output: {
    //         path: DIST_DIR,
    //         filename: 'server.js'
    //     },
    //     externals: nodeModules,
    //     // module: {
    //     //     loaders : [
    //     //         {
    //     //             test: /\.jsx?$/,
    //     //             exclude: /(node_modules|bower_components)/,
    //     //             loader: 'babel-loader',
    //     //             query: {
    //     //                 "presets": ["es2017-node7"],
    //     //             }
    //     //         }
    //     //     ]
    //     // },
    //     plugins: [
    //         new webpack.BannerPlugin( {
    //             banner: 'require("source-map-support").install();',
    //             raw: true,
    //             entryOnly: false })
    //     ],
    //     devtool: 'sourcemap'

    // }
];

module.exports = config;
