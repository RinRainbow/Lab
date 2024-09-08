const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: true,
  },
  datasetName: {
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
    required: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Datasetname', schema);
