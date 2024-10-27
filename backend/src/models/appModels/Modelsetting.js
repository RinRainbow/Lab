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
  datasetname: {
    type: String,
    required: true,
  },
  detector: {
    type: String,
    trim: true,
    required: true,
  },
  status:{
    type: String,
    trim: true,
    required: false,
    default: "untrained",

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

  rotation:{
    type: [Number],
    trim: true,
    required: false,
  },
  widthShift:{
    type: Number,
    trim: true,
    required: false,
  },
  heightShift:{
    type: Number,
    trim: true,
    required: false,
  },
  zoom:{
    type: [Number],
    trim: true,
    required: false,
  },
  shear:{
    type: [Number],
    trim: true,
    required: false,
  },
  fill:{
    type: Number,
    trim: true,
  },
  horizontalFlip:{
    type: Number,
    trim: true,
    required: false,
  },

  hiddenDim:{
    type: Number,
    trim: true,
    required: false,
  },
  dropoutValue:{
    type: Number,
    trim: true,
    required: false,
  },
  preprocessMethod:{
    type: String,
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Modelsetting', schema);
