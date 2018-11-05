var webpack = require('webpack');
var path = require('path');
var execSync = require('child_process').execSync;

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var Visualizer = require('webpack-visualizer-plugin');

var debug = process.env.NODE_ENV !== "production";

let version = execSync('git describe --tags --abbrev=0');

console.log('version ' + version);

console.log('building with NODE_ENV=' + process.env.NODE_ENV);
console.log('building with UBAT_URL=' + process.env.UBAT_URL);
console.log('building with UBAT_PORT=' + process.env.UBAT_PORT);

var buildPages = process.env.BUILD_PAGES;

var APP_DIR = path.resolve(__dirname, 'src/client');
var DIST_DIR = buildPages ? path.resolve(__dirname, 'docs') : path.resolve(__dirname, 'dist');

let htmlPlug = new HtmlWebpackPlugin({
    template: APP_DIR + '/index.template.ejs',
    inject: 'body'
});

const defPlug = new webpack.DefinePlugin({
    UBAT_VERSION: JSON.stringify(version.toString())
});

// the default value is taken when the environment variable is not set
const envPlug = new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    UBAT_URL: 'localhost',
    UBAT_PORT: '13750'
});

const copyPlug = new CopyWebpackPlugin([
    {from: "./assets", to: "assets/"}
]);

var config = {
    name: 'client',
    mode: debug ? 'development' : 'production',
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
                    presets: ["@babel/react",
                              ["@babel/env",
                              {
                                  targets: {
                                      edge: "17",
                                      firefox: "60",
                                      chrome: "67",
                                      safari: "11.1",
                                  },
                                  useBuiltIns: "usage",
                              }]
                             ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true}], //mobx
                        ["@babel/plugin-proposal-class-properties", { "loose": true}], //mobx
                        ["transform-imports", {
                            "react-bootstrap": {
                                "transform": "react-bootstrap/lib/${member}",
                                "preventFullImport": true
                            }
                        }]

                    ]
                }
            },
        ]
    },
    resolve: {
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat'
        },
        extensions: [".js", ".jsx", ".json"]
    },
    plugins: debug ? [
        htmlPlug,
        defPlug,
        envPlug,
        copyPlug

    ] : [
        htmlPlug,
        defPlug,
        envPlug,
        copyPlug,
        new Visualizer(),
        new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
        new webpack.optimize.AggressiveMergingPlugin()//Merge chunks
    ],
    devtool: debug ? "cheap-eval-source-map" : false,
    devServer: {
        contentBase: DIST_DIR,
        host: '0.0.0.0',
        port: 8080,
        inline: true,
        historyApiFallback: true
    }
};

module.exports = config;
