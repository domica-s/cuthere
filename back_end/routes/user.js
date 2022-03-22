var express = require("express");

var User = require("../models/user");

var router = express.Router();

// var userSchema = mongoose.Schema({
//     username:{type:String, required:true},
//     sid:{type:Number, required:true, unique:true},
//     email:{type:String, required:true, unique:true},
//     password:{type:String, required:false},
//     mobileNumber:{type:Number, default:0},
//     profilePicture:{type:mongoose.Schema.Types.ObjectId},
//     interests:{type:String},
//     college:{type:String},
//     about:{type:String},
//     rating:{type:String},
//     friends:{type:String},
//     createdAt:{type:Date, default:Date.now}
// });

router.get("/:sid", function(req,res){
    User.findOne({sid:req.params.sid}).exec(function(err, users){
        if(err){console.log(err);}

        res.render("user/user", {user:users});
    });
});


module.exports = router;