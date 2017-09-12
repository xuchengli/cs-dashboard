const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const production = process.env.NODE_ENV === "production";

let config = {
    entry: "./web/js/index.js",
    output: {
        path: path.join(__dirname, "public"),
        filename: production ? "js/[name].[chunkhash].js" : "js/bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)$/,
                loader: "url-loader",
                options: {
                    name: "[hash:6].[ext]",
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Cognitive Solution Dashboard"
        })
    ]
};
if (production) {
    config = merge(config, {
        plugins: [
            new CleanWebpackPlugin(["public"])
        ]
    });
} else {
    config = merge(config, {
        devServer: {
            contentBase: "./public"
        }
    });
}
module.exports = config;
