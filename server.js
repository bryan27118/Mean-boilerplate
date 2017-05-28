//Module Dependencies
var express = require("express");
var path = require('path');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require('passport');

//Load Config
var env = process.env.NODE_ENV || "development";
var config = require('./config/' + env + '.js');

//Connect to Database
mongoose.connect(config.db);

//App configuration
app.set('views', path.join(__dirname, 'layouts'));
app.set('view engine', 'jade');
//app.use(require('prerender-node').set('prerenderServiceUrl', '<new url>'));
app.use(require("prerender-node").set('prerenderToken', 'FbmJpFz8bIO0C5NOP3D9'));
app.use(session({ secret: config.secret, resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//passport configuration
require('./passport.js')(passport);

//Define routes
app.use(require('./routes')(passport));

app.listen(config.port);
console.log("Server running on port " + config.port);