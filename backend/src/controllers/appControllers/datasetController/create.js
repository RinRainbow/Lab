const mongoose = require('mongoose');
const DatasetnameModel = mongoose.model("Datasetname");

const create = async (Model, req, res) => {
  let body = req.body;
  const createdBy = req.admin._id;

  console.log("dataset creating");
  // first one element in the strarray will be the datasetName
  // the others are the datas which in this dataset
  let datasetName = "Undefined";
  let newdata = {
    dataId:"undefined",
    datasetName:datasetName,
  };
  newdatas = [];

  body.forEach((dataid, index)=> {
    if(index == 0)
      datasetName = dataid;
    else{
      newdata = {
        "dataId":new mongoose.Types.ObjectId(dataid),
        "datasetName":datasetName,
        "createdBy": req.admin._id,
      };
      newdatas.push(newdata);
    }
    
  });
  console.log(datasetName);

  let dataset = await Model.findOne({
    datasetName: datasetName,
  });
  if (dataset) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'dataset Already Exist',
    });
  }
  const result = await Model.insertMany(newdatas);
  const datasetnameResult = await DatasetnameModel({"datasetName":datasetName,"createdBy": req.admin._id,}).save();
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
