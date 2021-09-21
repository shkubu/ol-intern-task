const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  titleEn: {
    type: String,
    required: true
  },
  text1: {
    type: String,
    required: true
  },
  textEn: {
    type: String,
    required: true
  },
  mainImageUrl: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true,
  }
  // extraImageUrl: {
  //   type: String,
  //   required: true
  // }
  // creator: {
  //   type: Object,
  //   required: String
  // }
}, {timestamps: true});

module.exports = mongoose.model('news', newsSchema);
