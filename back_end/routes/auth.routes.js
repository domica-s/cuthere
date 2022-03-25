const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
      "Access-Control-Allow-Origin"
    );
    next();
  });
  app.post("/api/auth/signup", [verifySignUp.checkDuplicateSID, verifySignUp.checkDuplicateUsername], controller.signup);
  app.post("/api/auth/signin", controller.signin);
  app.get("/api/auth/forgotpassword/:sid", controller.forgotPasswordRequest);
  app.post("/api/auth/passwordreset/:sid/:token", controller.resetPassword);
  app.post("/api/auth/changepassword", [authJwt.verifyToken], controller.changePassword);
  app.get("/api/auth/confirmation/:sid/:token", controller.verifyEmail);
  app.get("/api/auth/resendverification/:sid", controller.resendVerificationLink);
  app.post("/profile/update",  [authJwt.verifyToken], controller.updateProfile);
};