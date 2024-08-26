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
  datasetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Datasetname',
    required: true,
  },
  detector: {
    type: String,
    trim: true,
    required: true,
  },


  batchSize: {
    type: Number,
    trim: true,
    required: false,
  },
  trainRatio: {
    type: Number,
    trim: true,
    required: false,
  },
  validationRatio: {
    type: Number,
    trim: true,
    required: false,
  },
  learningRate: {
    type: Number,
    trim: true,
    required: false,
  },
  epochs: {
    type: Number,
    trim: true,
    required: false,
  },
  shard: {
    type: Number,
    trim: true,
    required: false,
  },
  slice: {
    type: Number,
    trim: true,
    required: false,
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
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Modelsetting', schema);
