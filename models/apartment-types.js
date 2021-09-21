const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apartmentTypesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  roomsCount: {
    type: Number,
    required: false
  },
  rooms: [{
    nameKa: String,
    nameEn: String,
    area: String
  }],
  imagesDirName: {
    type: String,
    required: true
  },
  images2DUrls: {
    type: Array,
    required: false
  },
  images3DUrls: {
    type: Array,
    required: false
  }
  // creator: {
  //   type: Object,
  //   required: String
  // }
}, {timestamps: true});

module.exports = mongoose.model('apartmentTypes', apartmentTypesSchema);
