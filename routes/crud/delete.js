var express = require('express');
var router = express.Router();
var Task = require("../../models/Task");

router.delete('/todo/:id', function(req, res) {
    var id = req.params.id;

    Task.remove({
        _id: id
    }, function(err, doc) {
        res.json(doc);
    });
});

module.exports = router;