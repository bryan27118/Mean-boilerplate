var express = require('express');
var router = express.Router();
var Task = require("../../models/Task");

router.post('/todo/task', function(req, res) {
    var task = {
        name: req.body.name,
        status: 0
    };

    Task.create(task, function(err, task) {
        res.json(task);
    });
});

module.exports = router;