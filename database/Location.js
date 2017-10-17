var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = new Schema({
    title: String,
    address: String,
    postcode: String,
    customer: [String],
    createdAt: {type: Date, default: Date.now },
});


var Location = mongoose.model('Location', Location);
module.exports = Location;