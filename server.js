var express = require("express");
var path = require('path');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('todolist',['todolist']);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
	res.sendfile(path.resolve('public/views/index.html'));
});

app.get('/api/todolist',function(req, res){
	db.todolist.find(function(err, docs){
		res.json(docs);
	});
});

app.post('/api/todolist/addtask',function(req, res){
	console.log(req.body.name);
	var task = { 
		name: req.body.name,
		status: 0
	};
	db.todolist.insert(task,function(err, doc){
		res.json(doc);
	});
});

app.delete('/api/todolist/removetask/:id',function(req, res){
	var id = req.params.id;
	db.todolist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});

app.post('/api/todolist/edittask/markdone/:id',function(req, res){
	var id = req.params.id;
	db.todolist.findAndModify({query: {_id: mongojs.ObjectId(id)}, update: {$set: {status: 1}}, new: true}, function(err, doc){
		res.json(doc);
	});
});

app.post('/api/todolist/edittask/marknotdone/:id',function(req, res){
	var id = req.params.id;
	db.todolist.findAndModify({query: {_id: mongojs.ObjectId(id)}, update: {$set: {status: 0}}, new: true}, function(err, doc){
		res.json(doc);
	});
});

app.listen(3000);
console.log("Server running on port 3000");