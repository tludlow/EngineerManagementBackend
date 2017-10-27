var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobDeletions = new Schema({
  user: String,
  job: String,
  createdAt: {type: Date, default: Date.now },
});


var JobDeletions = mongoose.model('JobDeletions', JobDeletions);
module.exports = JobDeletions;