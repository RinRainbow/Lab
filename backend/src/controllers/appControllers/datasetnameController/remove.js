const mongoose = require('mongoose');
const DatasetModel = mongoose.model("Dataset");

const remove = async (Model, req, res) => {
  // Find the document by id and delete it
  let updates = {
    removed: true,
  };
  console.log(req.params);
  // Find the document by id and delete it
  const resultData =  await DatasetModel.deleteMany({ datasetID:req.params.id});
  const result = await Model.findByIdAndDelete(req.params.id,
  /*findOneAndUpdate(
    { _id: req.params.id, removed: false },
    { $set: updates },*/
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found by this id: ' + req.params.id,
    });
  } else {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Deleted the document' ,
    });
  }
};

module.exports = remove;

