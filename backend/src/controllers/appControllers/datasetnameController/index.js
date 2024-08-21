const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');


const read = require('./read');
const remove = require('./remove');
const paginatedList = require('./paginatedList');
const listAll = require('./listAll');

function modelController() {
  const modelName = 'Datasetname';
  const Model = mongoose.model(modelName);
  const methods = createCRUDController(modelName);
  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  return methods;
}

module.exports = modelController();
