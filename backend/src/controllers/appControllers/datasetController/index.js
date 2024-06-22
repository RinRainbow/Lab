const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const create = require('./create');
const read = require('./read');
const remove = require('./remove');
const paginatedList = require('./paginatedList');

function modelController() {
  const modelName = 'Dataset';
  const Model = mongoose.model(modelName);
  const methods = createCRUDController(modelName);
  methods.create = (req, res) => create(Model, req, res);
  methods.read = (req, res) => read(Model, req, res);
  methods.delete = (req, res) => remove(Model, req, res);
  methods.list = (req, res) => paginatedList(Model, req, res);
  return methods;
}

module.exports = modelController();
