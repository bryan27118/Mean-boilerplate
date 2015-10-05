// config/passport.js
var https = require('https');

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

//Load Config
var env = process.env.NODE_ENV || "development";
var config = require('./config/' + env + '.js');
var utils = require("./routes/controllers/utilities.js");

// load up the user model
var User = require('./models/User.js');
var bcrypt = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("Serialized " + user.name);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            if (user != null) {
                //console.log("Deserialized " + user.name);
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            //console.log("Signup: " + username + " " + password + " " + req.body.email);
            User.findOne({
                $or: [{
                    'name': username
                }, {
                    'email': req.body.email
                }]
            }, function(err, user) {
                //User already exists
                if (user != null) {
                    console.log("Already exists");
                    return done(null, false);
                } else {
                    console.log("Creating");
                    var salt = bcrypt.genSaltSync(10);
                    var token = bcrypt.genSaltSync(10);
                    password = bcrypt.hashSync(password,salt);
                    //create
                    User.create({
                        name: username,
                        password: password,
                        email: req.body.email,
                        token: token,
                        allowEmail: true
                    }, function(err, newUser) {
                        utils.sendEmailtoUser(newUser._id, "Verify your email address - MEAN", "Thanks for signing up! Click the following link to verify your email address: " + config.hostname + "/verify?token=" + token + "");
                        return done(null, newUser);
                    });
                }
            });
        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            //console.log("Login: " + username + " " + password);
            User.findOne({
                'name': username
            }, function(err, user) {
                if (user) {
                    return user.checkPassword(password, done);
                } else {
                    console.log('No user found with that name.');
                    return done(null, false);
                }
            });
        }));

};