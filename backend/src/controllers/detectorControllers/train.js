const fs = require('fs');
const fsp = require('fs').promises;
const mongoose = require('mongoose');
const path = require('path');
const { spawn } = require('child_process');
const folderpath = '/home/campbell/Lab/backend/path.json';
const configPath = '/mnt/pysrc/dataToPython.json'
config = {};

const replacePlaceholder = (str, name) => {
    if (str && typeof str === 'string')
        return str.replace('${Name}', name);
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

const train = async (Model, req, res) => {
    model = {};
    pyFileName = '';
    const { _id, enabled, modelName , datasetId, detector, isPublic , createdBy , created, updated , __v  ,...remainbody } = req.body[0];

    await createFolders(modelName, detector);
    if(detector == "MalwareExpert"){
        pyFileName = '/mnt/pysrc/pycode/MalwareExpertForBackend/src/main.py'; 
        model =  {
            "epoch": 10,
            "learning_rate": 0.01,
            "batch_size": 32,
            "hidden_dim": 100,
            "shard_count": 2,
            "slice_count": 2,
            "dropout_value": 0.5,
            "output_dim": 2,
            "softmax_dim": 1
        }
    }
    else if(detector == "MDOEL"){
        pyFileName = '/mnt/pysrc/pycode/Malware-detection-for-IoT-with-opcodes/Code/main.py';
        model =  {
            "model_name": "CNN",
            "batch_size": remainbody.batchSize,
            "train_ratio": 0.8,
            "learning_rate": remainbody.learningRate,
            "epochs": remainbody.epochs,
            "shard": remainbody.shard,
            "slice":  remainbody.slice,
            "hidden_dim": 100,
            "shard_count": 2,
            "slice_count": 2
        }
    }
    else if(detector == "IMCNF"){
        pyFileName = '/mnt/pysrc/pycode/isLab/IMCFN/Code/main.py';
        model =  {
            "model_name": "VGG16",
            "batch_size": 4,
            "learning_rate": 5e-6,
            "rotation": [0, 0],
            "width_shift": 0.0,
            "height_shift": 0.0,
            "zoom": [1.0, 1.0],
            "shear": [0, 0, 0, 0],
            "fill": null,
            "horizontal_flip": 0,
            "train_ratio": 0.8,
            "epochs": 30,
            "shard": 1,
            "slice": 1,
            "print_information": "",
            "save_image": false
        }
    }
    else{

        return res.status(203).json({
            success: false,
            result: [],
            message: "detector doesn't exsit.",
        });
    }
    console.log(req.body);
    config = {...config, 
        model,
        "preprocess_method": "asm2vec",
        "classify": false,
        "train": true,
        "predict": false,
        "unlearn": false
    }
    //config.json
    const label = await mongoose.model('Dataset').find({ datasetID: datasetId });

    // merge 2 .json for input
    const userInput = JSON.stringify({
        ...config,
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

            // err from .py
            pythonProcess.stderr.on('data', (data) => {
                console.error(`from .py: ${data.toString()}`);
            });

            // subprocess ends
            pythonProcess.on('close', (code) => {
                console.log(`child process closed with code ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`.py closed with code: ${code}`));
                }
            });


        }).then(() => {
            console.log("123done");
            const theInput = JSON.parse(userInput);
            return res.status(200).json({
                success: true,
                theInput,
                message: 'Successfully trained',
            });
        }).catch((error) => {
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

module.exports = train;