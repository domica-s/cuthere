const config = require("../config/auth.config");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;

    const user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(password, salt),
        sid: req.body.sid,
        email:req.body.sid + "@link.cuhk.edu.hk",
        mobileNumber:0,
        // profilePicture:"",
        interests:"",
        college:"",
        about:"",
        rating:"",
        friends:"",
        registeredEvents: [],
        role: "User"
    });

    user.save((err, user) => {
        if (err) {
        res.status(500).send({ message: err });
        return;
        }
        user.save(err => {
            if (err) {
            res.status(500).send({ message: err });
            return;
            }
            res.send({ message: "User was registered successfully!" });
        });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    sid: req.body.sid
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      console.log(user);
      res.status(200).send({
        accessToken: token,
        user
      });

    });
};