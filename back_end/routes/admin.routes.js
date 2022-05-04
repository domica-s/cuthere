// The code is the routes for the admin functionalities
// PROGRAMMER: Domica
// Revised on 5/5/2022

const { JsonWebTokenError } = require("jsonwebtoken");
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
    app.post("/admin/user/:sid/delete", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
    app.post("/admin/user/:sid/updatepassword", [authJwt.verifyToken, authJwt.isAdmin], controller.changeUserPass);
    app.post("/admin/user/:sid/removerating", [authJwt.verifyToken, authJwt.isAdmin], controller.removeUserRating);
    app.post("/admin/event/:eventid/delete", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteEvent);
    app.post("/admin/event/:eventid/removecomment", [authJwt.verifyToken, authJwt.isAdmin], controller.removeEventComments);
  
  };