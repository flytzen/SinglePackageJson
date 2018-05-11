const path = require("path");
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { CheckerPlugin, TsConfigPathsPlugin } = require("awesome-typescript-loader");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].css"
});

const DIST_DIR = "dist";

let tslintOptions = {};

if (process.env.NODE_ENV === 'production') {
    tslintOptions.failOnHint = true;
}
let styleLintOptions = {
    files: "**/*.scss",
    emitErrors: false
};

const config = {
    entry: {
        adminapp: path.resolve(__dirname, "src/Admin.App/src/index.tsx")
    },
    output: {
        path: path.resolve(__dirname, DIST_DIR),
        filename: 'js/[name].js'
    },
    resolve: {
        plugins: [
            new TsConfigPathsPlugin()
          ],
          extensions: ['.ts', '.tsx', '.js']
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "tslint-loader",
                enforce: "pre",
                options: tslintOptions
            },
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader",
                include: [path.resolve(__dirname, "src")]
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: ["css-loader", "resolve-url-loader", "sass-loader?sourceMap"],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: "url-loader?limit=100000&name=css/[name].[ext]"
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        extractSass,
        new StyleLintPlugin(styleLintOptions),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/), // Load the en-gb moment locale (only)
        new FileManagerPlugin({
            onEnd: {
                copy: [
                   { source: path.resolve(__dirname, DIST_DIR, '**/admin*.*'), destination: path.resolve(__dirname, 'src/Admin.Web/wwwroot') }
                ]
            }
        })
    ]
}



if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());

    styleLintOptions.emitErrors = true;
    styleLintOptions.failOnError = true;
}


module.exports = config;