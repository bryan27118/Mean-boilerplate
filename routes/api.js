var express = require('express');
var router = express.Router();
var Task = require("../models/Task").Task;

module.exports = function(db,mongojs){
	router.get('/todolist',function(req, res){
		Task.find({}, function(err, docs){
			res.json(docs);
		});
	});

	router.post('/todolist/addtask',function(req, res){
		var task = { 
			name: req.body.name,
			status: 0
		};

		Task.create(task, function(err, task){
			res.json(task);
		});
	});

	router.delete('/todolist/removetask/:id',function(req, res){
		var id = req.params.id;

		Task.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
			res.json(doc);
		});
	});

	router.post('/todolist/edittask/markdone/:id',function(req, res){
		var id = req.params.id;

		Task.update({ _id: mongojs.ObjectId(id) }, { status: 1 }, function(err, numberAffected, doc){	
			res.json(doc);
		});
	});

	router.post('/todolist/edittask/marknotdone/:id',function(req, res){
		var id = req.params.id;

		Task.update({ _id: mongojs.ObjectId(id) }, { status: 0 }, function(err, numberAffected, doc){
			res.json(doc);
		});
	});

	return router;
}