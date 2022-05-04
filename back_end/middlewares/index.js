// The codes are used for exporting the back-end middlewares
// PROGRAMMER: Domica
// This js file is to handle the backend middlewares
// Revised on 5/5/2022

const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");

module.exports = {
  authJwt,
  verifySignUp
};