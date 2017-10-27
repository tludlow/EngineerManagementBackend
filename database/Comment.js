var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    content: String,
    user: String,
    job: String,
    createdAt: {type: Date, default: Date.now },
});


var Comment = mongoose.model('Comment', Comment);
module.exports = Comment;