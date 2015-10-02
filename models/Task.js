var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
  name: String,
  status: Number
});

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;