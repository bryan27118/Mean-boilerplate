var express = require("express");
var router = express.Router();
var path = require('path');
//Load Config
var env = process.env.NODE_ENV || "development";
var config = require('../config/' + env + '.js');

module.exports = function(passport) {
    router.use('/api', require('./api'));
    router.use('/auth', require('./auth')(passport));

    router.get('*', function(req, res) {
        res.render('layout', {
            app: config.app
        });
    });

    return router;
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}