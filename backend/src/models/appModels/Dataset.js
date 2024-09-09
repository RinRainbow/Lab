const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true,
  },
  datasetID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DatasetName',
    required: true,
  },
  filename: {
    type: String,
    trim: true,
    required: true,
  },
  origFileName: {
    type: String,
    trim: true,
    required: true,
  },
  label: {
    type: String,
    trim: true,
    required: true,
  },
  family: {
    type: String,
    trim: true,
    required: false,
  },
  CPUArchitecture: {
    type: String,
    trim: true,
    required: true,
  },
  fileSize: {
    type: String,
    trim: true,
    required: true,
  },
  tags: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      default:"test",
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
    required: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Dataset', schema);
