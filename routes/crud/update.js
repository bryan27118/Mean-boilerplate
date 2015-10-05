var express = require('express');
var router = express.Router();
var utils = require("../controllers/utilities.js");
var Task = require("../../models/Task");
var User = require("../../models/User");

router.post('/user/password', utils.ensureAuthenticated, function(req, res) {

    if(req.body.newpassword != req.body.newrepassword){
        res.send("Passwords do not match");
        return;
    }

    req.user.checkPassword(req.body.password, function(err, response){
        if(response){
            req.user.setPassword(req.body.newpassword);
            res.send("true");
        }else{
            res.send("Incorrect password");
        }
    });

});

router.post('/user/email', utils.ensureAuthenticated, function(req, res) {

    req.user.checkPassword(req.body.emailpassword, function(err, response){
        if(response){
            req.user.setEmail(req.body.email);
            res.send("true");
        }else{
            res.send("Incorrect password");
        }
    });

});

router.post('/user/settings', utils.ensureAuthenticated, function(req, res) {
    User.update({
        _id: req.user._id
    }, {
        allowEmail: req.body.allowemail
    }, function(err, numberAffected, doc) {
        res.send("true")
    });
});

router.post('/user/role/:id', utils.ensureAuthenticated, utils.ensureAdmin, function(req, res) {
    var id = req.params.id;

    User.update({
        _id: id
    }, {
        role: req.body.role
    }, function(err, numberAffected, doc) {
        res.json(doc);
    });

});

router.post('/user/email/:id', utils.ensureAuthenticated, utils.ensureAdmin, function(req, res) {
    var id = req.params.id;

    User.update({
        _id: id
    }, {
        email: req.body.email
    }, function(err, numberAffected, doc) {
        res.json(doc);
    });

});

router.post('/todo/done/:id', function(req, res) {
    var id = req.params.id;

    Task.update({
        _id: id
    }, {
        status: 1
    }, function(err, numberAffected, doc) {
        res.json(doc);
    });
});

router.post('/todo/notdone/:id', function(req, res) {
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