const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
  email: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false,
    index: 'text'
  },
  personId: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false,
    index: 'text'
  },
  unread: {
    type: Boolean,
    required: false
  },
  projectName: {
    type: String,
    required: false
  },
  apartmentName: {
    type: String,
    required: false
  },
  comment: {
    type: String,
    required: false,
    index: 'text'
  },
  source: {
    type: String,
    required: false
  },
  tagName: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  areaRange: {
    type: {
      min: Number,
      max: Number
    },
    required: false
  }
}, {timestamps: true});
ordersSchema.index({comment: 'text'});
module.exports = mongoose.model('orders', ordersSchema);
