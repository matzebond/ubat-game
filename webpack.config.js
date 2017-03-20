var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var debug = process.env.NODE_ENV !== "production";

console.log(process.env.NODE_ENV);

var buildPages = process.env.BUILD_PAGES;

var APP_DIR = path.resolve(__dirname, 'src/client');
var DIST_DIR = buildPages ? path.resolve(__dirname, 'docs') : path.resolve(__dirname, 'dist');

let htmlPlug = new HtmlWebpackPlugin({
    template: APP_DIR + '/index.template.ejs',
    inject: 'body'
});

const envPlug = new webpack.EnvironmentPlugin({
    NODE_ENV : debug ? "development" : "production",
    HEADS_UP_BACKEND_IP: "localhost",
    HEADS_UP_BACKEND_PORT: "13750"
});

const copyPlug = new CopyWebpackPlugin([
    {from: "assets/", to: "assets/"}
]);

var config = {
    name: 'client',
    entry: APP_DIR + '/index.js',
    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
        publicPath: buildPages ? '/heads-up-web/' : '/'
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
        htmlPlug,
        envPlug,
        copyPlug

    ] : [
        htmlPlug,
        envPlug,
        copyPlug,
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
        new webpack.optimize.AggressiveMergingPlugin()//Merge chunks
    ],
    devtool: debug ? "cheap-eval-source-map" : false,
    devServer: {
        contentBase: DIST_DIR,
        host: '0.0.0.0',
        port: 8080,
        inline:true,
        historyApiFallback: true
    }
};

module.exports = config;
