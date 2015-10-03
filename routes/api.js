var express = require('express');
var router = express.Router();
var Task = require("../models/Task");


router.use('/create', require('./crud/create'));
router.use('/read', require('./crud/read'));
router.use('/update', require('./crud/update'));
router.use('/delete', require('./crud/delete'));

module.exports = router;