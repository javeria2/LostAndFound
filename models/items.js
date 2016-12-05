var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    locationLat: Number,
    locationLon: Number,
    postDate: { type: Date, default: Date.now },
    date: Date,
    img: String,
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String,
		img: String
	}
});

module.exports = mongoose.model('items', ItemSchema);