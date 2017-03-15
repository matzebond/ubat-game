var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var debug = process.env.NODE_ENV !== "production";

var buildPages = process.env.BUILD_PAGES;

var APP_DIR = path.resolve(__dirname, 'src/client');
var DIST_DIR = buildPages ? path.resolve(__dirname, 'docs') : path.resolve(__dirname, 'dist');

let htmlPlug = new HtmlWebpackPlugin({
    template: APP_DIR + '/index.template.ejs',
    inject: 'body'
});

var config = {
    name: 'client',
    entry: APP_DIR + '/index.js',
    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ["react", "es2015", "stage-0"],
                    plugins: ['transform-decorators-legacy', 'transform-class-properties'] // needed for mobX
                }
            },
        ]
    },
    plugins: debug ? [
        htmlPlug
    ] : [
        htmlPlug,
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
    devtool: debug ? "cheap-eval-source-map" : null,
    devServer: {
        contentBase: DIST_DIR,
        host: '0.0.0.0',
        port: 8080,
        inline:true,
        historyApiFallback: true
    }
};

module.exports = config;
