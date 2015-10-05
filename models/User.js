var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verifiedEmail: {
    type: Boolean,
    default: false
  },
  token: String,
  allowEmail: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.methods.checkPassword = function checkPassword(password, done){
    var user = this;
    bcrypt.compare(password, this.password, function(err, res) {
        if (res == true) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}

UserSchema.methods.setPassword = function setPassword(pass){
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(pass,salt);
    this.save();
}

UserSchema.methods.setEmail = function setEmail(newEmail){
    this.verifiedEmail = false;
    this.email = newEmail
    this.save();
}

UserSchema.methods.setRole = function setRole(role){
    this.role = role;
    this.save();
}

var User = mongoose.model('User', UserSchema);

module.exports = User;