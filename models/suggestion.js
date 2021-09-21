const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suggestionSchema = new Schema({
  mainImageUrl: {
    type: String,
    required: true
  }
  // creator: {
  //   type: Object,
  //   required: String
  // }
}, {timestamps: true});

module.exports = mongoose.model('suggestion', suggestionSchema);
