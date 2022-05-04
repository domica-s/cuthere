// The codes are used for middlewares for authentication
// PROGRAMMER: Pierson and Domica
// This js file is to handle the middleware for authentication
// Revised on 5/5/2022

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/user");

verifyToken = (req, res, next) => {
                /*
      This function is used to verify the validity of the token
      Requirements (header): pass x-access token into the header 
      */

  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
                  /*
      This function is used to check if the specific user is admin or not
      */
     
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user.role === "Admin") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
    return;
  })
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;