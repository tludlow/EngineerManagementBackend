var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Job = new Schema({
  title: String,
  body: String,
  createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
  assignedTo: [{type: Schema.Types.ObjectId, ref: 'User'}],
  dateDue: Date,
  location: {type: Schema.Types.ObjectId, ref: 'Location'},
  createdAt: {type: Date, default: Date.now },
});


var Job = mongoose.model('Job', Job);
module.exports = Job;