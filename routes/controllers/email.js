var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var utils = require("./utilities.js");
var env = process.env.NODE_ENV || "development";
var config = require('../../config/' + env + '.js');

router.post('/verify', utils.ensureAuthenticated, function(req, res) {
	//console.log(req.user.token);
	//console.log(req.body.token);
	if(req.user.token == req.body.token){
	    User.update({
	        _id: req.user._id
	    }, {
	        verifiedEmail: true
	    }, function(err, numberAffected, doc) {
	    	res.send("true");
	    });
	}else{
		res.send("Error");
	}
});

router.post('/reverify', utils.ensureAuthenticated, function(req, res) {
	if(req.user.verifiedEmail == false){
		var token = bcrypt.genSaltSync(10);
		utils.sendEmailtoUser(req.user._id, "Verify your email address - MEAN", "Thanks for signing up! Click the following link to verify your email address: " + config.hostname + "/verify?token=" + token + "");
	    User.update({
	        _id: req.user._id
	    }, {
	        token: token
	    }, function(err, numberAffected, doc) {
	    	res.send("true");
	    });
	}else{
		res.send("Error");
	}
});

router.post('/all', function(req, res) {
	utils.sendEmailtoAll(req.body.subject, req.body.message);
	res.send("true");
});

router.post('/user/:id', function(req, res) {
	var id = req.params.id;
	utils.sendEmailtoUser(id, req.body.subject, req.body.message);
	res.send("true");
});

module.exports = router;