const { modelsFiles } = require('@/models/utils');
const mongoose = require('mongoose');
const upload = require('./upload.js');

const transferControllers = () => {

  if (!modelsFiles.includes(modelName)) {
    throw new Error(`api does not exist`);
  }

  let Methods = {

    upload: (req, res) => upload(req, res),
  };

  
return Methods;
};

module.exports = transferControllers;
