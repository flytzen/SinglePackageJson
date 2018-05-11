const path = require("path");
const webpack = require('webpack');
const { CheckerPlugin } = require("awesome-typescript-loader");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "css/[name].css"
});

const DIST_DIR = "dist";

const config = {
    entry: {
        adminapp: path.resolve(__dirname, "src/Admin.App/src/index.tsx"),
        customerapp: path.resolve(__dirname, "src/Customer.App/src/index.tsx")
    },
    output: {
        path: path.resolve(__dirname, DIST_DIR),
        filename: 'js/[name].js'
    },
    resolve: {
          extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader",
                include: [path.resolve(__dirname, "src")]
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: ["css-loader", "resolve-url-loader", "sass-loader?sourceMap"],
                    fallback: "style-loader"
                })
            },
        ]
    },
    plugins: [
        new CheckerPlugin(),
        extractSass
    ]
}

module.exports = config;