var express = require('express');
var router = express.Router();
var Task = require("../../models/Task");
var User = require("../../models/User");

router.get('/todo/all', function(req, res) {
    Task.find({}, function(err, docs) {
        res.json(docs);
    });
});

router.get('/user', function(req, res) {
    res.json(req.user);
});

router.get('/user/:id', function(req, res) {
	var id = req.params.id;

	User.findOne({_id: id}, function(err, user){
		res.json(user);
	});
});

router.get('/users/all', function(req, res) {
	User.find({},function(err, users){
		res.json(users);
	});
});

module.exports = router;