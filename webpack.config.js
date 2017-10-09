const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const production = process.env.NODE_ENV === "production";

let config = {
    entry: production ?
            ["./web/js/index.js"] :
            ["webpack-hot-middleware/client?reload=true", "./web/js/index.js"],
    output: {
        path: path.join(__dirname, "public"),
        filename: production ? "js/[name].[chunkhash].js" : "js/bundle.js"
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
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
            template: "./index.ejs",
            env: process.env.NODE_ENV
        })
    ]
};
if (production) {
    config = merge(config, {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: {
                            loader: "css-loader",
                            options: {
                                minimize: true
                            }
                        }
                    })
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: {
                        extractCSS: true,
                        loaders: {
                            i18n: "@kazupon/vue-i18n-loader"
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: '"production"'
                }
            }),
            new CleanWebpackPlugin(["public"]),
            new ExtractTextPlugin("css/[name].[chunkhash].css"),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                minChunks: function (module) {
                    return module.context && module.context.indexOf("node_modules") !== -1;
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "manifest"
            }),
            new webpack.optimize.UglifyJsPlugin({
                comments: false,
                compress: {
                    warnings: false
                }
            })
        ]
    });
} else {
    config = merge(config, {
        output: {
            publicPath: require("./modules/configuration").Context_Path
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            i18n: "@kazupon/vue-i18n-loader"
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ]
    });
}
module.exports = config;
