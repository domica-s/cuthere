var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

// fix profilepicture, friends setup, interests
var userSchema = mongoose.Schema({
    username:{type:String, required:true, unique:true},
    sid:{type:Number, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:false},
    mobileNumber:{type:Number, default:0},
    profilePicture:{type:mongoose.Schema.Types.ObjectId},
    interests:{type:String},
    college:{type:String},
    about:{type:String},
    rating:{type:String},
    friends:{type:String},
    registeredEvents:[{type:String}],
    role:{type:String, enum: ['User', 'Admin']},
    active:{type:Boolean, default: false},
    createdAt:{type:Date, default:Date.now}
});

// userSchema.pre("save", function(done){
//     var user = this;

//     if(!user.isModified("password")){
//         return done();
//     }

//     bcrypt.genSalt(SALT_FACTOR, function(err,salt){
//         if(err){return done(err);}
//         bcrypt.hash(user.password, salt, function(err, hashedPassword){
//             if(err) {return done(err);}
//             user.password = hashedPassword;
//             done();
//         });
//     });

// });

// userSchema.methods.checkPassword = function(guess, done){
//     if(this.password != null){
//         bcrypt.compare(guess,this.password, function(err, isMatch){
//             done(err, isMatch);
//         });
//     }
// }

var User = mongoose.model("User", userSchema);

module.exports = User;