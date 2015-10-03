var express = require('express');
var router = express.Router();
var Task = require("../../models/Task");

router.get('/todo/all', function(req, res) {
    Task.find({}, function(err, docs) {
        res.json(docs);
    });
});

router.get('/user', function(req, res) {
    res.json(req.user);
});

module.exports = router;