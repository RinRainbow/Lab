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
  TP: {
    type: Number,
    trim: true,
    required: true,
  },
  TN: {
    type: Number,
    required: true,
  },
  FP: {
    type: Number,
    required: true,
  },
  FN: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  precision: {
    type: Number,
    required: true,
  },
  recall: {
    type: Number,
    required: true,
  },
  f1_score: {
    type: Number,
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
module.exports = mongoose.model('Score', schema);
