const { modelsFiles } = require('@/models/utils');
const mongoose = require('mongoose');
const listChosen = require('./listChosen.js');
const runPy = require('./runPy.js')

const detectorControllers = (modelName) => {
  modelName = "Dataset";
  
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  const Model = mongoose.model(modelName);
  let crudMethods = {
    listChosen: (req, res) => listChosen(Model, req, res),
    runPy: (req, res) => runPy(Model, req, res),
  };

  
return crudMethods;
};

module.exports = detectorControllers;
