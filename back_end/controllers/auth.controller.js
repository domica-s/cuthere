const config = require("../config/auth.config");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var crypto = require("crypto")
const Token = require("../models/emailToken");

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
        // generate token and save
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex'), for: "verifemail" });
        token.save(function (err) {
          if(err){
            return res.status(500).send({msg:err.message});
          }

            // Send email (use credintials of SendGrid)
            // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            // var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
            // transporter.sendMail(mailOptions, function (err) {
            //     if (err) { 
            //         return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
            //      }
            //     return res.status(200).send('A verification email has been sent to ' + user.email + '. It will expire after one day. If you not get verification Email click on resend token.');
            // });
          let email_content =  'Hello '+ user.username +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/auth/confirmation\/' + user.sid + '\/' + token.token + '\n\nThank You!\n'
          console.log(email_content)
        });
        res.send({ message: "User was registered successfully! Please verify your account" });
        // user.save(err => {
        //   if (err) {
        //     res.status(500).send({ message: err });
        //     return;
        //   }
        //   res.send({ message: "User was registered successfully! Please verify your account" });
        // });
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

    if (user.active) {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      return res.status(200).send({
        accessToken: token,
        user
      });
    }
    else {
      return res.status(401).send({
        message:'Your Email has not been verified. Please click on resend to get a new verification link.'});
    }
  });
};


// GET request, with URL params sid -- http://localhost:8080/api/auth/forgotpassword/:sid
exports.forgotPasswordRequest = (req, res) => {
  User.findOne({
    sid: req.params.sid
  })
  .exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    Token.deleteMany({ _userId: user._id, for: "resetpassword" }).then(function() {
      console.log("Old token deleted");
    }).catch(function(error) {
      console.log(error);
    });

    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex'), for: "resetpassword" });
    token.save(function (err) {
      if(err){
        return res.status(500).send({msg:err.message});
      }

      user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        let email_content =  'Hello '+ user.username +',\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/auth/passwordreset\/' + user.sid + '\/' + token.token + '\n\nThank You!\n'
        console.log(email_content)
        res.status(200).send({
          message: "Successfully sent password reset link."});
      });
    })
  });
} 

// POST request, with URL params sid, token -- http://localhost:8080/api/auth/passwordreset/:sid/:token
// body password
exports.resetPassword = (req, res) => {
  User.findOne({
    sid: req.params.sid
  })
  .exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    Token.findOne({ token: req.params.token, for: "resetpassword" }, function (err, token) {
      if (!token) {
        return res.status(400).send({
          message: "Your password reset link may have expired. Please click on resend to get a new reset link. "});
      }

      let newPassword = req.body.password;
      const salt = bcrypt.genSaltSync(10);

      user.password = bcrypt.hashSync(newPassword, salt),

      user.save((err) => {
        if (err) {
          return res.status(500).send({message: err});
        }
        else {
          return res.status(200).send({
            message: 'Your password has been successfully changed'});
        }
      })
    });
  });
}

// Secured POST request, with URL
// body oldPassword, newPassword, sid
exports.changePassword = (req, res) => {
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
      req.body.oldPassword,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid current password!"
      });
    }

    let newPassword = req.body.newPassword;
    const salt = bcrypt.genSaltSync(10);

    user.password = bcrypt.hashSync(newPassword, salt);
    user.save((err) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      else {
        return res.status(200).send({
          message: 'Your password has been successfully changed'});
      }
    });
  });
}

exports.verifyEmail = (req, res) => {
  Token.findOne({ token: req.params.token, for: "verifemail" }, function (err, token) {
    if (!token) {
      return res.status(400).send({
        message: "Your verification link may have expired. Please click on resend to get a new verification link. "});
    }
    else {
      User.findOne({ _id: token._userId, sid: req.params.sid }, function (err, user) {
        if (!user) {
          return res.status(401).send({
            message: "We were unable to find a user for this verification. Sign up instead"});
        }
        // user is already verified
        else if (user.active){
          return res.status(200).send({
            message: 'User has been already verified. Please Login'});
        }
        // verify user
        else {
          // change active to true
          user.active = true;
          user.save(function (err) {
            // error occur
            if(err) {
                return res.status(500).send({message: err});
            }
            // account successfully verified
            else{
              return res.status(200).send({
                message: 'Your account has been successfully verified'});
            }
          });
        }
      })
    }
  })
}

exports.resendVerificationLink = (req, res) => {
  // req.params.sid /:sid --> get sid from link
  // console.log(req.params.sid);
  User.findOne({ sid: req.params.sid }, function (err, user) {
      // user is not found into database
      if (!user){
        return res.status(400).send({
          message: 'We were unable to find a user with that SID.'});
      }
      // user has been already verified
      else if (user.active){
        return res.status(200).send({
          message: 'This account has been already verified. Please log in.'});
      } 
      // send verification link
      else{
        // delete existing token
        Token.deleteMany({ _userId: user._id, for: "verifemail" }).then(function() {
          console.log("Old token deleted");
        }).catch(function(error) {
          console.log(error);
        });
        // generate token and save
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex'), for: "verifemail" });
        token.save(function (err) {
          if (err) {
            return res.status(500).send({message: err});
          }

          // Send email (use credentials of SendGrid)
          // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
          // var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
          // transporter.sendMail(mailOptions, function (err) {
          //     if (err) { 
          //     return res.status(500).send({
          //       message: 'Technical Issue! Please click on the resend button'});
          //   }
          // return res.status(200).send({
          //   message: 'A verification email has been sent to ' + user.email + '. It will be valid for one day.'});
          // });
          let email_content =  'Hello '+ user.username +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/auth/confirmation\/' + user.sid + '\/' + token.token + '\n\nThank You!\n'
          console.log(email_content)
          res.status(200).send({
            message: "Your new verification link has been sent."});
        });
      }
  })
}