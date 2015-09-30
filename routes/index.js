var express = require("express");
var router = express.Router();
var path = require('path');

router.use('/api', require('./api');

router.get('/', function(req, res){
	res.sendfile(path.resolve(__dirname + '/../views/index.html'));
});

module.exports = router;