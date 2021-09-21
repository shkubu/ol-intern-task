const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crmSchema = new Schema({
  oldId: {
    type: Number,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  personId: {
    type: String,
    required: false
  },
  createTime: {
    type: Number,
    required: false
  },
  updateTime: {
    type: Number,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  projectName: {
    type: String,
    required: false
  },
  apartmentName: {
    type: String,
    required: false
  },
  comments: [{
    comment: String,
    insertDate: Number
  }],
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
  unread: {
    type: Boolean,
    required: false
  },
  areaRange: {
    type: {
      min: Number,
      max: Number
    },
    required: false
  }
}, {timestamps: false});
module.exports = mongoose.model('crm', crmSchema);
