var express = require('express');
var router = express.Router();
var Task = require("../../models/Task");
var utils = require("./utilities.js");

//----------CREATE----------//
router.post('/task', function(req, res) {
    var task = {
        name: req.body.name,
        status: 0
    };

    Task.create(task, function(err, task) {
        res.json(task);
    });
});
//----------/CREATE----------//

//----------READ----------//
router.get('/all', function(req, res) {
    Task.find({}, function(err, docs) {
        res.json(docs);
    });
});
//----------/READ----------//

//----------UPDATE----------//
router.post('/done/:id', function(req, res) {
    var id = req.params.id;

    Task.update({
        _id: id
    }, {
        status: 1
    }, function(err, numberAffected, doc) {
        res.json(doc);
    });
});

router.post('/notdone/:id', function(req, res) {
    var id = req.params.id;

    Task.update({
        _id: id
    }, {
        status: 0
    }, function(err, numberAffected, doc) {
        res.json(doc);
    });
});

//----------/UPDATE----------//

//----------DELETE----------//
router.delete('/:id', function(req, res) {
    var id = req.params.id;

    Task.remove({
        _id: id
    }, function(err, doc) {
        res.json(doc);
    });
});

//----------/DELETE----------//

module.exports = router;