const mongoose = require('mongoose');
const DatasetnameModel = mongoose.model("Datasetname");
const DatasetModel = mongoose.model("Dataset");
//
const fs = require('fs');
const csv = require('csv-parser');
const { once } = require('events');
var count = 0;

const upload = async (req, res) => {
    try {
        const results = [];
        const promises = [];
        const datasetname = req.body.datasetnmae;
        console.log("123");
        console.log(req.admin._id );
        const userID = req.admin._id;
        
        
        let datasetnameID;

        let datasetExist = await DatasetnameModel.findOne({
            datasetName: datasetname,
          });
          if (datasetExist) {
            datasetnameID = datasetExist._id;
          }
          else
          {
            datasetnameResult = await DatasetnameModel({"datasetName":datasetname,"createdBy": userID,}).save();
            datasetnameID = datasetnameResult._id;
            ;
          }
        
        const stream = fs.createReadStream('/home/campbell/Lab/backend/src/controllers/transferControllers/dataset.csv')
        .pipe(csv())
        stream.on('data', (data) => {
            results.push(data);
            promises.push(setupDataset(data, datasetnameID , userID));
        })
    // Wait for the 'end' event of the stream
    await once(stream, 'end');

    // Wait for all the promises to resolve
    await Promise.all(promises);
    
    console.log("done:D");
    process.exit();
    }catch (e) {
        console.log('\n🚫 Error! The Error info is below');
        console.log(e);
        process.exit();
    }
};

const setupDataset = async(data, datasetnameID,userID) =>{
    try {
        const savingData = {
            filename: data.filename,
            origFileName: data.filename,
            label: data.label,
            family: data.family,
            CPUArchitecture: data["CPU Architecture"],
            fileSize: data["file size"],
            isPublic: false,
            createdBy: userID,
            datasetID: datasetnameID
          };
          //console.log(savingData);
          //console.log(count);
          const result = await DatasetModel.insert(savingData);
          console.log(result);


    }catch (e) {
        console.log('\n🚫 Error! The Error info is below');
        console.log(e);
        process.exit();
    }
};



module.exports = upload;
