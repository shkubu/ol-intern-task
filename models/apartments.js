const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apartmentsSchema = new Schema({
  projectId: {
    type: String,
    required: true
  },
  floorTypeId: {
    type: String,
    required: true
  },
  apartmentType: {
    type: Object,
    required: true
  },
  apartmentName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  floor: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sold: {
    type: Boolean,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('apartments', apartmentsSchema);
