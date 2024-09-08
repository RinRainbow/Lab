const mongoose = require('mongoose');
const DatasetnameModel = mongoose.model("Datasetname");

const create = async (Model, req, res) => {
  let body = req.body;
  const userID = req.admin._id;

  console.log("dataset creating");
  // first one element in the strarray will be the datasetName
  // the others are the datas which in this dataset
  let datasetName = req.body[0];

  //check datasetName exists or not
  let datasetExist = await DatasetnameModel.findOne({
    datasetName: datasetName,
  });
  if (datasetExist) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'dataset Already Exist',
    });
  }
  const datasetnameResult = await DatasetnameModel({"datasetName":datasetName,"createdBy": userID,}).save();
  const datasetnameID = datasetnameResult._id;

  //datas
  newdatas = [];
  body.forEach((dataid, index)=> {
    if(index == 0)
      ;
    else{
      //delete some attributes
      let { removed ,enabled ,__v ,...newdata } = {datasetID:datasetnameID, ...dataid,createdBy:userID};
      newdatas.push(newdata);
    }
  });
  const result = await Model.insertMany(newdatas);

  //const datasetnameResult = await DatasetnameModel.create({"datasetName":datasetName});
  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: {
      insertedDatas: result,
      datasetNameInserted: datasetnameResult,
    },
    message: 'dataset created successfully',
  });
};

module.exports = create;
