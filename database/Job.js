var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Job = new Schema({
  title: String,
  body: String,
  createdBy: String,
  assignedTo: String,
  dateDue: Date,
  createdAt: {type: Date, default: Date.now },
});


var Job = mongoose.model('Job', Job);
module.exports = Job;