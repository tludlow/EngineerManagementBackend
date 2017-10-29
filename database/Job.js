var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Job = new Schema({
  title: String,
  body: String,
  createdBy: String,
  assignedTo: [String],
  dateDue: Date,
  location: String,
  deleted: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now },
});


var Job = mongoose.model('Job', Job);
module.exports = Job;