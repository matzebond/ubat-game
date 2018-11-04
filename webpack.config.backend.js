var webpack = require('webpack');
var path = require('path');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var debug = process.env.NODE_ENV !== "production";

var SRC_DIR = path.resolve(__dirname, 'src/backend');
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
        name: 'backend',
        mode: debug ? 'development' : 'production',
        entry: SRC_DIR + '/index.js',
        target: 'node',
        node: {
            __filename: false,
            __dirname: false //__dirname points to the directory of the bundled file
        },
        output: {
            path: BUILD_DIR,
            filename: 'backend.js'
        },
        // dont bundle sqlite and sqlite3 because native modules don't want to be bundled
        externals: {
            sqlite: 'commonjs sqlite',
            sqlite3: 'commonjs sqlite3'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            ["@babel/env", {
                                targets: {
                                    node: "10"
                                }
                            }]
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true}], //mobx
                            ["@babel/plugin-proposal-class-properties", { "loose": true}], //mobx
                        ]
                    }
                }
            ]
        },
        plugins: debug ? [
            envPlug,
            copyPlug,
            // new webpack.BannerPlugin( {
            //     banner: 'require("source-map-support").install();',
            //     raw: true,
            //     entryOnly: false }),
        ]
        : [envPlug, copyPlug],
        devtool: debug ? 'sourcemap' : false

    }
];

module.exports = config;
