var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var debug = process.env.NODE_ENV !== "production";

var SERVER_DIR = path.resolve(__dirname, 'src/server');
var BUILD_DIR = path.resolve(__dirname, 'build');

const envPlug = new webpack.EnvironmentPlugin({
    NODE_ENV : debug ? "development" : "production",
    UBAT_IP: "localhost",
    UBAT_PORT: "13750"
});

const copyPlug = new CopyWebpackPlugin([
    {from: "./migrations", to: "migrations/"},
]);

var config = [
    {
        name: 'server',
        entry: SERVER_DIR + '/server_promises.js',
        target: 'node',
        node: {
            __filename: false,
            __dirname: false //__dirname points to the directory of the bundled file
        },
        output: {
            path: BUILD_DIR,
            filename: 'server.js'
        },
        // dont bundle sqlite and sqlite3 because native modules don't want to be bundled
        externals: {
            sqlite: 'commonjs sqlite',
            sqlite3: 'commonjs sqlite3'
        },
        module: {
            loaders : [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: ["es2017-node7"],
                        plugins: ['transform-decorators-legacy', 'transform-class-properties']
                    }
                }
            ]
        },
        plugins: debug ? [
            envPlug,
            copyPlug,
            new webpack.BannerPlugin( {
                banner: 'require("source-map-support").install();',
                raw: true,
                entryOnly: false }),
        ]
        : [envPlug, copyPlug],
        devtool: debug ? 'sourcemap' : false

    }
];

module.exports = config;
