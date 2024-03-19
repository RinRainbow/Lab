const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  filename: {
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

  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
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
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('dataset', schema);
