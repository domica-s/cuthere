const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

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
  app.post("/confirmation/:sid/:token", controller.verifyEmail);
  app.post("/api/auth/resendverification", controller.resendVerificationLink);
};