var express = require('express');
var router = express.Router();
var Task = require("../../models/Task");
var User = require("../../models/User");

router.post('/user/password', ensureAuthenticated, function(req, res) {

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

router.post('/user/email', ensureAuthenticated, function(req, res) {

    req.user.checkPassword(req.body.emailpassword, function(err, response){
        if(response){
            req.user.setEmail(req.body.email);
            res.send("true");
        }else{
            res.send("Incorrect password");
        }
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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}