var express = require("express");
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('todolist',['todolist']);
var path = require('path');

router.use('/api', require('./api')(db,mongojs));

router.get('/', function(req, res){
	res.sendfile(path.resolve(__dirname + '/../views/index.html'));
});

module.exports = router;