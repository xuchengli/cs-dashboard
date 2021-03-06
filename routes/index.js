const path = require("path");

module.exports = function(app, contextPath) {
    app.use(path.join(contextPath, "api"), require("./api"));
    app.use(path.join(contextPath, "video"), require("./video"));
    app.use(path.join(contextPath, "ai-vision"), require("./ai-vision"));
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err.message);
    });
};
