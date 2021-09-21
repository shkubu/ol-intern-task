const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const floorsSchema = new Schema({
  projectId: {
    type: String,
    required: true
  },
  floorTypeId: {
    type: String,
    required: true
  },
  floorTypeName: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('floors', floorsSchema);
