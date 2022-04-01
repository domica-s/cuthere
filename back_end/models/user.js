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
    interests:[{type:String}],
    college:{type:String},
    about:{type:String},
    rating:{type:String},
    following:[{type: mongoose.Schema.Types.ObjectId}],
    followers:[{type: mongoose.Schema.Types.ObjectId}],
    registeredEvents:[{type: mongoose.Schema.Types.ObjectId}],
    starredEvents:[{type: mongoose.Schema.Types.ObjectId}],
    role:{type:String, enum: ['User', 'Admin']},
    active:{type:Boolean, default: false},
    reviewHistory:[{
        user: {type: Number, ref: 'User'},
        type: {type: Boolean},
        content: {type: String},
        reviewAt: {type: Date, default:Date.now},
    }],
    createdAt:{type:Date, default:Date.now},
    name:{type:String, default:this.username},
    birthday:{type:Date},
    country:{type:String},
});

var User = mongoose.model("User", userSchema);
userSchema.pre('save', function (next) {
    this.username = this.get('username'); // considering _id is input by client
    next();
});


module.exports = User;