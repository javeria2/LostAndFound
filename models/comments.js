/**
 * Created by mamoruohara on 12/5/16.
 */
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    message: { type: String, required: true },
    postDate: { type: Date, default: Date.now },
    item:   {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        },
        title: String
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        img: String
    }
});

module.exports = mongoose.model('comments', CommentSchema);