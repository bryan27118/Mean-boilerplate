var express = require('express');
var router = express.Router();
var Task = require("../models/Task");

router.post('/user', function(req, res) {
    res.json(req.user);
});

router.get('/todolist', function(req, res) {
    Task.find({}, function(err, docs) {
        res.json(docs);
    });
});

router.post('/todolist/addtask', function(req, res) {
    var task = {
        name: req.body.name,
        status: 0
    };

    Task.create(task, function(err, task) {
        res.json(task);
    });
});

router.delete('/todolist/removetask/:id', function(req, res) {
    var id = req.params.id;

    Task.remove({
        _id: id
    }, function(err, doc) {
        res.json(doc);
    });
});

router.post('/todolist/edittask/markdone/:id', function(req, res) {
    var id = req.params.id;

    Task.update({
        _id: id
    }, {
        status: 1
    }, function(err, numberAffected, doc) {
        res.json(doc);
    });
});

router.post('/todolist/edittask/marknotdone/:id', function(req, res) {
    var id = req.params.id;

    Task.update({
        _id: id
    }, {
        status: 0
    }, function(err, numberAffected, doc) {
        res.json(doc);
    });
});

module.exports = router;