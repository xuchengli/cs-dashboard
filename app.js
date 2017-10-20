const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./modules/configuration");
const app = express();
const env = process.env.NODE_ENV || "production";

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.mongodb.uri, {
    useMongoClient: true,
    bufferMaxEntries: 0
}, err => {
    if (err) console.error(err);
});
mongoose.Promise = global.Promise;

if (env == "development") {
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const webpackConfig = require("./webpack.config");
    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));

    require("./routes")(app, config.Context_Path);

    const reload = require("reload");
    const http = require("http");
    const server = http.createServer(app);
    reload(app);
    server.listen(8080, function() {
        console.log("Development server started>>>");
    });
} else {
    app.use(config.Context_Path, express.static(path.join(__dirname, "public")));
    require("./routes")(app, config.Context_Path);
    app.listen(8080, function() {
        console.log("Server started>>>");
    });
}
