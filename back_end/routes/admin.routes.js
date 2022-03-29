const controller = require("../controllers/admin.controller");
const { authJwt, isAdmin } = require("../middlewares");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin"
      );
      next();
    });
    
    app.get("/admin/query/sid/:sid", [authJwt.verifyToken, authJwt.isAdmin], controller.getSID);
    app.get("/admin/query/event/:eventid", [authJwt.verifyToken, authJwt.isAdmin], controller.getEventId);
    app.get("/admin/query/recent", [authJwt.verifyToken, authJwt.isAdmin], controller.loadRecentUsersAndEvents);
};