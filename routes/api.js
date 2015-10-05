var express = require('express');
var router = express.Router();
var User = require("../models/User");

router.use('/user', require('./controllers/user'));
router.use('/todo', require('./controllers/todo'));
router.use('/email', require('./controllers/email'));

module.exports = router;