const express = require("express");
const path = require("path");
const app = express();

app.use("/cs", express.static(path.join(__dirname, "public")));

app.listen(8080, function() {
    console.log("Server started>>>");
});
