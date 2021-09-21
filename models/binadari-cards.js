const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  companies: [{
    name: String,
    nameEn: String,
    salePercent: String,
    location: String,
    locationEn: String,
    facebookUrl: String,
    phoneNumber: String,
    mail: String,
    webSiteUrl: String,
    imagePath: String
  }]
  // creator: {
  //   type: Object,
  //   required: String
  // }
}, {timestamps: true});

module.exports = mongoose.model('cards', cardsSchema);
