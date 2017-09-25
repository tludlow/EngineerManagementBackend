var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Storie = new Schema({
  author: String,
  title: String,
  body: String,
  category: String,
  staffPicked: {type: Boolean, default: false},
  verifiedUser: {type: Boolean, default: false},
  likes: [],
  comments: [Schema.Types.Mixed], //This is a mixed object, it will look like {author: Thomas, comment: Hello its me, date: Whatever data/time it was posted.}
  createdAt: {type: Date, default: Date.now },
});


var Storie = mongoose.model('Storie', Storie);
module.exports = Storie;