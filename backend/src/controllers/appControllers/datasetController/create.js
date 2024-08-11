const create = async (Model, req, res) => {
  let body = req.body;
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
        dataId:dataid,
        datasetName:datasetName,
      };
      newdatas.push(newdata);
    }
    
  });
  console.log(newdatas);
  const result = await new Model.insertMany(newdatas);

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'dataset created successfully',
  });
};

module.exports = create;
