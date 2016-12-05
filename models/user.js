// var mongoose = require('mongoose');

// var UsersSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     password: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: Number, required: true },
//     items: [String]
// });

// module.exports = mongoose.model('users', UsersSchema);

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

//setup user schema
var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	about: String,
	img: String,
	followers: [{id: String}],
	following: [{id: String}]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);