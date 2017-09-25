var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    post: [Schema.Types.ObjectId],
    author: String,
    body: String,
    verifiedUser: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now },
});


var Comment = mongoose.model('Comment', Comment);
module.exports = Comment;