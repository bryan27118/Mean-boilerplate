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
app.use(session({ secret: config.secret, resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./passport.js')(passport); // pass passport for configuration
//Define routes
app.use(require('./routes')(passport));

app.listen(3000);
console.log("Server running on port 3000");