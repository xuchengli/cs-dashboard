const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./modules/configuration");
const app = express();

//signed cookie
app.use(cookieParser("cognitive solution dashboard"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.mongodb.uri, { useMongoClient: true });

app.use("/cs", express.static(path.join(__dirname, "public")));
app.use("/cs/api", require("./routes/api"));
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(8080, function() {
    console.log("Server started>>>");
});
