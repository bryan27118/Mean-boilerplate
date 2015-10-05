var express = require('express');
var router = express.Router();
var User = require("../models/User");

module.exports = function(passport) {
    router.post('/login', passport.authenticate('local-login'), function(req, res) {
        res.json(req.user);
    });

    router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
        res.json(req.user);
    });

    router.get('/user', function(req, res) {
        res.json(req.user);
    });

    router.post('/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    router.post('/logout', function(req, res) {
        req.logOut();
        res.json(req.user);
    });

    return router;
}