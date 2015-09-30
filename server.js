//Module Dependencies
var express = require("express");
var path = require('path');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

//App configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(session({ secret: 'superdupersecret', resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//Connect to Database
mongoose.connect('mongodb://localhost/todolist');

//Define routes
app.use(require('./routes'));

app.listen(port);
console.log("Server running on port " + port);