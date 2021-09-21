const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectsSchema = new Schema({
  nameKa: {
    type: String,
    required: false
  },
  nameEn: {
    type: String,
    required: false
  },
  sloganKa: {
    type: String,
    required: false,
  },
  sloganEn: {
    type: String,
    required: false,
  },
  descriptionKa: {
    type: String,
    required: false
  },
  descriptionEn: {
    type: String,
    required: false
  },
  defaultPrice: {
    type: Number,
    required: false
  },
  backgroundOpacity: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  blockName: {
    type: String,
    required: false
  },
  blockNameEn: {
    type: String,
    required: false
  },
  floors: {
    type: Number,
    required: false
  },
  videoUrl: {
    type: String,
    required: false
  },
  startDate: {
    type: String,
    required: false
  },
  endDate: {
    type: String,
    required: false
  },
  coordinates: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  locationEn: {
    type: String,
    required: false
  },
  showInHomePage: {
    type: Boolean,
    required: false
  },
  keyword: {
    type: String,
    required: false
  },
  leftApartmentCount: {
    type: Number,
    required: false
  },
  apartmentCount: {
    type: Number,
    required: false
  },
  mainImageUrl: {
    type: String,
    required: false
  },
  blockImageUrl: {
    type: String,
    required: false
  },
  projectFileUrl: {
    type: String,
    required: false
  },
  sliderImageUrls: {
    type: Array,
    required: false
  },
  blockImageSvgViewBox: {
    type: String,
    required: false
  },
  blockImageSvgPaths: {
    type: [{
      floor: Number,
      path: String,
      points: [{
        x: Number,
        y: Number
      }]
    }],
    required: false
  },
  sortIndex: {
    type: Number,
    required: false
  }
  // creator: {
  //   type: Object,
  //   required: String
  // }
}, {timestamps: true});

module.exports = mongoose.model('projects', projectsSchema);
