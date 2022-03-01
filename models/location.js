var mongoose = require("mongoose");

var locationSchema = mongoose.Schema({
	locId: { type: Number, required: true, unique: true },
	name: { type: String, required: true },
	quota: { type: Number },
});

var Location = mongoose.model("Location", LocationSchema);

module.exports = Location;