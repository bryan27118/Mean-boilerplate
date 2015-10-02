var mongoose = require("mongoose");

var ModelSchema = new mongoose.Schema({
  name: String,
  equipped: Boolean,
  owner_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  room_id: {
    type: mongoose.Schema.Types.ObjectId
  }
});

//To load this from a controller
//var Model = require("../models/SampleModel").Model;
var Model = mongoose.model('Model', ModelSchema);

module.exports = Model;