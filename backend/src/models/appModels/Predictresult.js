const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  enabled: {
    type: Boolean,
    default: true,
  },
  modelName: {
    type: String,
    trim: true,
    required: true,
  },
  dataname: {
    type: String,
    trim: true,
    required: true,
  },
  detection: {
    type: String,
    trim: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Predictresult', schema);
