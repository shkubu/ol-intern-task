const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const floorTypesSchema = new Schema({
  projectId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  floor: {
    type: String,
    required: true
  },
  apartments: {
    type: Array,
    required: false
  },
  mainImageUrl: {
    type: String,
    required: true
  },
  floorImageSvgViewBox: {
    type: String,
    required: false
  },
  floorImageSvgPaths: [{
    path: String,
    textPosition: {
      x: Number,
      y: Number
    },
    apartmentTypeId: String,
    points: [{
      x: Number,
      y: Number
    }]
  }]
}, {timestamps: true});

module.exports = mongoose.model('floor-types', floorTypesSchema);
