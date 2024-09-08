const { modelsFiles } = require('@/models/utils');
const mongoose = require('mongoose');
const runPy = require('./runPy.js');
const train = require('./train.js');

const detectorControllers = () => {
  modelName = "Dataset";
  
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  const Model = mongoose.model(modelName);
  let crudMethods = {
    runPy: (req, res) => runPy(Model, req, res),
    train: (req, res) => train(Model, req, res),
  };

  
return crudMethods;
};

module.exports = detectorControllers;
