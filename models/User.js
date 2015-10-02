var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

UserSchema.pre('save', function(next){
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password,salt);
    console.log(this.password);
    next();
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

var User = mongoose.model('User', UserSchema);

module.exports = User;