const { loadSettings, increaseBySettingKey } = require('@/middlewares/settings');

const { generateUniqueNumber } = require('@/middlewares/inventory');

const create = async (Model, req, res) => {
  let body = req.body;

  body['createdBy'] = req.admin._id;

  const settings = await loadSettings();
  const last_model_number = settings['last_model_number'];

  body.number = generateUniqueNumber(last_model_number);
  // Creating a new document in the collection
  const result = await new Model(body).save();

  // Returning successfull response
  increaseBySettingKey({ settingKey: 'last_model_number' });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'modelsetting created successfully',
  });
};

module.exports = create;
