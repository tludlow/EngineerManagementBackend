var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var User = new Schema({
  username: String,
  email: String,
  password: String,
  role: {type: String, default: "user"},
  verified: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now },
});

User.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

User.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', User);
module.exports = User;