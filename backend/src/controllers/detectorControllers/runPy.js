const fs = require('fs');
const fsp = require('fs').promises;
const mongoose = require('mongoose');
//const createFolders = require('./createFolders.js');
const { spawn } = require('child_process');
const datapath = '/mnt/ssd500g/pysrc';
const folderpath = `${datapath}/path.json`;
const configPath = `${datapath}/dataToPython.json`;
config = {};

const replacePlaceholder = (str, name) => {
    let replacements = {
        '${Name}': name,
        '${datapath}': datapath,
      };
    if (str && typeof str === 'string')
        return str.replace(/\$\{Name\}|\$\{datapath\}/g, match => replacements[match]);
    // 返回空字符串或其他默认值，以防止 replace 操作失败
    return '';
};

const createFolders = async (name, selectedDetector) => {
    try {
        // 讀取 JSON 文件
        const data = await fsp.readFile(folderpath, 'utf8');
        const jsonData = JSON.parse(data);

        // 根據選擇的 detector 確認是否存在對應的資料
        const detectorPath = jsonData[`${selectedDetector}_path`];
        const detectorFolder = jsonData[`${selectedDetector}_folder`];

        if (!detectorPath || !detectorFolder) {
            throw new Error(`Detector ${selectedDetector} not found.`);
        }

        // 替換 detector_path 和 detector_folder 中的 ${Name}
        const updatedPaths = {};
        for (const [key, value] of Object.entries(detectorPath)) {
            updatedPaths[key] = replacePlaceholder(value, name);
        }

        const updatedFolders = {};
        for (const [key, value] of Object.entries(detectorFolder)) {
            updatedFolders[key] = replacePlaceholder(value, name);
        }

        // 創建資料夾
        await Promise.all(
            Object.values(updatedFolders).map(folder => fsp.mkdir(folder, { recursive: true }))
        );

        config = { "path": updatedPaths, "folder": updatedFolders };

    } catch (err) {
        console.error('Error:', err);
    }
};

const SaveScore = async (filePath, modelName, createdBy) =>{
//save the result of score
console.log(filePath);
const scoreJson = await fsp.readFile(filePath, 'utf8');
const scoreData = JSON.parse(scoreJson);
const saveScore = {"modelName": modelName , ...scoreData[0].final_result, "createdBy": createdBy};
console.log(saveScore);
const ScorenameModel = mongoose.model("Score");
//cover the exist one
let ScoreExist = await ScorenameModel.findOne({
    "modelName": modelName,
  });
if (ScoreExist) {
const result = await ScorenameModel.findOneAndDelete({"modelName": modelName});
}
const scoreResult = await new ScorenameModel(saveScore).save();
}

const SaveResult = async (filePath, modelName, createdBy) => {
    // 讀取 JSON 檔案
    console.log(filePath);
    const scoreJson = await fsp.readFile(filePath, 'utf8');
    const scoreData = JSON.parse(scoreJson);
    // 遍歷每筆資料
    for (let i = 0; i < scoreData.length; i++) {
        let data = scoreData[i];
        // 將資料組合
        const saveResult = {
            modelName: modelName,
            dataname: data.name,
            detection: data.detection,
            createdBy: createdBy
        };
        console.log(saveResult);
        const PredictResultModel = mongoose.model("Predictresult");
        // 檢查是否已存在相同的 modelName
        let ScoreExist = await PredictResultModel.findOne({
            "modelName": modelName,
            "dataname": data.name // 檢查 name 是否已存在
        });
        // 如果存在，則刪除舊資料
        if (ScoreExist) {
            await PredictResultModel.findOneAndDelete({
                "modelName": modelName,
                "dataname": data.name
            });
        }
        // 保存新的資料
        await new PredictResultModel(saveResult).save();
    }
};


const runPy = async (mode, req, res) => {
   
    model = {};
    pyFileName = '';
    let body,label;
    if(mode == "predict"){
        body = req.body[0];
        console.log(req.body[0]);
    }
    else{
        body = req.body[0];
        
    }
    const { _id, enabled, modelName , datasetId, detector, isPublic , createdBy , created, updated , __v  ,...remainbody } = body;

    //label.json
    if(mode == "predict"){
        //const label1 = await mongoose.model('Dataset').find({ datasetID: datasetId });
        const leg = req.body.length;
        label = req.body.slice(1,leg);
        console.log(label);
        await mongoose.model('Modelsetting').findByIdAndUpdate(_id, { status: 'predicting' });
    }
    else if (mode == "train"){
        label = await mongoose.model('Dataset').find({ datasetID: datasetId });
        await mongoose.model('Modelsetting').findByIdAndUpdate(_id, { status: 'training' });
    }
    else if (mode == "unlearn"){
        label = await mongoose.model('Dataset').find({ datasetID: datasetId });
        await mongoose.model('Modelsetting').findByIdAndUpdate(_id, { status: 'unlearning' });
    }


    await createFolders(modelName, detector);

    if(detector == "MalwareExpert"){
        pyFileName = `${datapath}/pycode/MalwareExpertForBackend/src/main.py`; 
        model =  {
            "epoch":  remainbody.epochs,
            "learning_rate": remainbody.learningRate,
            "batch_size": remainbody.batchSize,
            "hidden_dim": remainbody.hiddenDim,
            "shard_count": remainbody.shard,
            "slice_count": remainbody.slice,
            "dropout_value": remainbody.dropoutValue,
            "output_dim": 2,
            "softmax_dim": 1
        }
    }
    else if(detector == "MDOEL"){
        pyFileName = `${datapath}/pycode/Malware-detection-for-IoT-with-opcodes/Code/main.py`;
        model =  {
            "model_name": "CNN",
            "batch_size": remainbody.batchSize,
            "train_ratio": remainbody.trainRatio,
            "learning_rate": remainbody.learningRate,
            "epochs": remainbody.epochs,
            "shard": remainbody.shard,
            "slice":  remainbody.slice,
        }
    }
    else if(detector == "IMCFN"){
        
        pyFileName = `${datapath}/pycode/isLab/IMCFN/src/code/main.py`;
        model =  {
            "model_name": "VGG16",
            "batch_size":  remainbody.batchSize,
            "learning_rate": remainbody.learningRate,
            "rotation": remainbody.rotation,
            "width_shift":  remainbody.widthShift,
            "height_shift": remainbody.heightShift,
            "zoom": remainbody.zoom,
            "shear": remainbody.shear,
            "fill": remainbody.fill,
            "horizontal_flip": remainbody.horizontalFlip,
            "train_ratio": remainbody.trainRatio,
            "epochs": remainbody.epochs,
            "shard": remainbody.shard,
            "slice":remainbody.slice,
            "print_information": "",
            "save_image": false,
            "overwrite": true
        }
    }
    else{

        return res.status(203).json({
            success: false,
            result: [],
            message: "detector doesn't exsit.",
        });
    }
    const scoref = config.path.score;
    const resultf = config.path.result;
    console.log(resultf);
    let train = false;
    let predict = false;
    let unlearn = false;
    if (mode == "train")
        train = true;
    if (mode == "predict")
        predict = true;
    if (mode == "unlearn")
        unlearn = true;

    config = {...config, 
        model,
        "preprocess_method": remainbody.preprocessMethod,
        "classify": false,
        "train": train,
        "predict": predict,
        "unlearn": unlearn
    }


    // merge 2 .json for input
    const userInput = JSON.stringify({
        config: {...config}, 
        label
    });

    fs.writeFile(configPath, userInput, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('File has been overwritten');
    });

    if (userInput.length > 0) {
        new Promise((resolve, reject) => {
            const pythonProcess = spawn('python3', [pyFileName, configPath]);

            // failed to start subprocess
            pythonProcess.on('error', (err) => {
                console.error('Failed to start subprocess:', err);
                reject(err);
            });
            
            // result from .py 
            pythonProcess.stdout.on('data', (data) => {
                console.log(`result from .py ${data.toString()}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`from .py: ${data.toString()}`);
            });

            // subprocess ends
            pythonProcess.on('close', async  (code) => {
                console.log(`child process closed with code ${code}`);
                if (code === 0) {
                    resolve();
                    if(mode == "train")
                        {
                             SaveScore(scoref, modelName, createdBy);
                            // 更新模型狀態為 trained
                            await mongoose.model('Modelsetting').findByIdAndUpdate(_id, { status: "trained" });
                             //const theInput = JSON.parse(userInput);
                             return res.status(200).json({
                                 success: true,
                                 message: 'Successfully trained',
                             });
            
                        }
                        else if(mode == "predict")
                        {
                            SaveResult(resultf, modelName, createdBy);
                            await mongoose.model('Modelsetting').findByIdAndUpdate(_id, { status: "trained" });
                            return res.status(200).json({
                                success: true,
                                message: 'Successfully predicted',
                            });
                        }
                        else if(mode == "unlearn")
                            {
                                await mongoose.model('Modelsetting').findByIdAndUpdate(_id, { status: "trained" });
                                return res.status(200).json({
                                    success: true,
                                    message: 'Successfully unlearned',
                                });
                            }
                } else {
                    await mongoose.model('Modelsetting').findByIdAndUpdate(_id, { status: "trained" });
                    reject(new Error(`.py closed with code: ${code}`));
                }
            });
        }).then(() => {
            console.log("123done");
        }).catch((error) => {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        });
    } else {
        return res.status(203).json({
            success: false,
            result: [],
            message: 'userInput is Empty',
        });
    }
};
module.exports = runPy;