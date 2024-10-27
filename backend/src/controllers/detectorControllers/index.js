const { modelsFiles } = require('@/models/utils');
const mongoose = require('mongoose');
const runPy = require('./runPy.js');

const detectorControllers = (mode) => {
  modelName = "Dataset";
  
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`mode ${mode} does not exist`);
  }

  const Model = mongoose.model(modelName);
  let crudMethods = {

    runPy: (req, res) => runPy(mode, req, res),
  };

  
return crudMethods;
};

module.exports = detectorControllers;
