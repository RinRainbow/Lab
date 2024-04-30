
// connect MongoDB 
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017";
mongoose.connect(url);

//.
const dataset = require('../models/appModels/Dataset');
//

const fs = require('fs');
const csv = require('csv-parser');



async function readDataset() {
    try {
        const results = [];
        fs.createReadStream('dataset.csv')
        .pipe(csv())
        .on('data', (data) => {
            results.push(data);
            //console.log(data);
            //const saving = data;
            //console.log(saving["file size"]);
            setupDataset(data);
        })
        .on('end', () => {
            console.log("done:D");
            process.exit();
          });
    }catch (e) {
        console.log('\n🚫 Error! The Error info is below');
        console.log(e);
        process.exit();
    }
}

async function setupDataset(data) {
    try {
        const savingData = {
            filename: data.filename,
            label: data.label,
            family: data.family,
            CPUArchitecture: data["CPU Architecture"],
            fileSize: data["file size"],
          };
          console.log(savingData);
        await new dataset(savingData).save();
    }catch (e) {
        console.log('\n🚫 Error! The Error info is below');
        console.log(e);
        process.exit();
    }
}



readDataset();

/*
        .on('end', () => {
            //console.log(results);
        });
*/