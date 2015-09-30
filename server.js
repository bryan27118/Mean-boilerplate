//Module Dependencies
var express = require("express");
var path = require('path');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

//Load Config
var env = process.env.NODE_ENV || "development";
var config = require('./config/' + env + '.js');

console.log(config.db);

//App configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session({ secret: config.secret, resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//Connect to Database
mongoose.connect(config.db);

//Define routes
app.use(require('./routes'));

app.listen(3000);
console.log("Server running on port 3000");