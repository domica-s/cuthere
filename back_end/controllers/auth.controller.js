const config = require("../config/auth.config");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var crypto = require("crypto")
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Token = require("../models/emailToken");
var params = require("../params/params");


function sendEmail(res, email_type, to_email, email_body) {
  // email_type
  // 0 for signup, 1 for resend verif link (sign up), 2 for forgot password
  let subject;
  let resMsgSuccess = "A verification email has been sent to " + to_email + ".";
  let resMsgFail = "Technical Issue! Please contact our moderators.";
  
  // console.log(email_body);

  if (email_type === 0) {
    subject = "Verify your CUthere account";
  }
  else if (email_type === 1) {
    subject = "Verify your CUthere account";
  }
  else if (email_type === 2) {
    subject = "Password reset request for CUthere";
    resMsgSuccess = "A password reset link has been sent to " + to_email + ".";
  }
  else {
    return res.status(500).send({message: resMsgFail});
  }

  var transporter = nodemailer.createTransport(
    sendgridTransport({
        auth:{
            api_key:params.SENDGRID_APIKEY,
        }
    })
  )

  var mailOptions = { 
    from: 'noreply.cuthere@gmail.com', 
    to: to_email, 
    subject: subject, 
    text: email_body
  };

  // delete this when deploy
  console.log(email_body);

  transporter.sendMail(mailOptions, function (err) {
      if (err) { 
        console.log(err);
        return res.status(500).send({message: resMsgFail});
      }
      return res.status(200).send({message: resMsgSuccess});
  });
}

exports.signup = (req, res) => {

    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const repassword = req.body.repassword;

    if (password !== repassword) {
      return res.status(404).send({ message: "Password and RePassword does not match"});
    }
    
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
        following: [],
        followers: [],
        //friends:"",
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

          let email_content =  'Hello '+ user.username +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + "localhost:3000" + '\/api/auth/confirmation\/' + user.sid + '\/' + token.token + '\n\nThank You!\n';
          return sendEmail(res, 0, user.email, email_content);
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

    if (user.active) {
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      
      return res.status(200).send({
        accessToken: token,
        _id: user._id,
        sid: user.sid,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
        profilePicture: user.profilePicture,
        interests: user.interests,
        college: user.college,
        about: user.about,
        rating: user.rating,
        friends: user.friends,
        role: user.role,
        reviewHistory: user.reviewHistory
      });
    }
    else {
      return res.status(401).send({
        isVerified: false,
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
      // console.log("Old token deleted");
    }).catch(function(error) {
      console.log(error);
    });

    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex'), for: "resetpassword" });
    token.save(function (err) {
      if(err){
        return res.status(500).send({msg:err.message});
      }

      let email_content =  'Hello '+ user.username +',\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + "localhost:3000" + '\/api/auth/passwordreset\/' + user.sid + '\/' + token.token + '\n\nThank You!\n'
      return sendEmail(res, 2, user.email, email_content);
    })
  });
} 

// POST request, with URL params sid, token -- http://localhost:8080/api/auth/passwordreset/:sid/:token
// body {password: { newPassword: String}, repassword: { newRePassword: String}}
exports.resetPassword = (req, res) => {
  let password = req.body.password.newPassword;
  // console.log(password);
  let repassword = req.body.repassword.newRePassword;
  // console.log(repassword);

  if (password !== repassword) {
    return res.status(404).send({ message: "Password and RePassword does not match"});
  }

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

    let passwordIsSame = bcrypt.compareSync(
      req.body.password.newPassword,
      user.password
    );

    if (passwordIsSame) {
      return res.status(400).send({message: "Your new password must be different from your old password."});
    }

    Token.findOneAndDelete({ token: req.params.token, for: "resetpassword" }, function (err, token) {
      if (!token) {
        return res.status(400).send({
          message: "Your password reset link may have expired. Please request a new link via the login page. "});
      }
      // console.log("Token found");
      let newPassword = req.body.password.newPassword;
      const salt = bcrypt.genSaltSync(10);

      user.password = bcrypt.hashSync(newPassword, salt),

      user.save((err) => {
        if (err) {
          return res.status(500).send({message: err});
        }
        else {
          // console.log("Change password success");
          return res.status(200).send({
            message: 'Your password has been successfully changed'});
        }
      })
    });
  });
}

// Secured POST request, with URL
// body oldPassword, newPassword, newRepassword, sid
exports.changePassword = (req, res) => {

  let password = req.body.newPassword;
  // console.log(password);
  let repassword = req.body.newRepassword;
  // console.log(repassword);

  let oldPassword = req.body.oldPassword;

  if (password !== repassword) {
    return res.status(404).send({ message: "Password and RePassword does not match"});
  }

  if (password === oldPassword) {
    return res.status(400).send({message: "Your new password must be different from your old password."});
  }

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
      res.status(400).send({
        message: "Your verification link may have expired. Please go to the login page, sign in and click on resend to get a new verification link. "});
    }
    else {
      User.findOne({ _id: token._userId, sid: req.params.sid }, function (err, user) {
        if (!user) {
          res.status(401).send({
            message: "We were unable to find a user for this verification. Sign up instead"});
        }
        // user is already verified
        else if (user.active){
          res.status(200).send({
            message: 'User has been already verified. Please Login'});
        }
        // verify user
        else {
          // change active to true
          user.active = true;
          user.save(function (err) {
            // error occur
            if(err) {
                res.status(500).send({message: err});
            }
            // account successfully verified
            else{
              res.status(200).send({
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
          // console.log("Old token deleted");
        }).catch(function(error) {
          console.log(error);
        });
        // generate token and save
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex'), for: "verifemail" });
        token.save(function (err) {
          if (err) {
            return res.status(500).send({message: err});
          }

          let email_content =  'Hello '+ user.username +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + "localhost:3000" + '\/api/auth/confirmation\/' + user.sid + '\/' + token.token + '\n\nThank You!\n'
          return sendEmail(res, 1, user.email, email_content);
        })
      }
  })
}

exports.updateProfile =  (req, res) => {
  User.findOne({ sid: req.body.sid }, function (err, user) {
    // user is not found into database
    if (!user){
      return res.status(400).send({
        message: 'We were unable to find a user with that SID.'});
    }
    user.mobileNumber = req.body.mobileNumber;
    user.interests = req.body.interests;
    user.about = req.body.about;
    user.save(function (err) {
      // error occur
      if(err) {
          res.status(500).send({message: err});
      }
      // account successfully updated
      else{
        res.status(200).send({
          message: 'Your account has been successfully updated'});
      }
    });
})

}