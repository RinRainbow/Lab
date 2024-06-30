const { modelsFiles } = require('@/models/utils');

const mongoose = require('mongoose');

const listChosen = require('./chooseList.js');


const detectorControllers = (modelName) => {
    modelName = "Dataset";
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  const Model = mongoose.model(modelName);
  let crudMethods = {
    listChosen: (req, res) => listChosen(Model, req, res),
  };
  return crudMethods;
};

module.exports = detectorControllers;
