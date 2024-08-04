const fs = require('fs');
const { spawn } = require('child_process');
//const pyFileName = '/home/senior/Lab/pysrc/pycode/isLab/IMCFN/Code/main.py';
const pyFileName = '/home/senior/Lab/pysrc/pycode/Malware-detection-for-IoT-with-opcodes/Code/main.py'; 
const configPath = '/home/senior/Lab/pysrc/dataToPython.json'
const datasetfolder = "/home/senior/Lab/pysrc/data/dataset202312/data";

const runPy = async (Model, req, res) => {
    const sort = parseInt(req.query.sort) || 'desc';
    //search the chosen data
    //const label = await Model.find({ removed: false, "CPUArchitecture": "ARM"}).limit(10).sort({ created: sort }).populate().exec();
    const label = req.body;

    //config.json
    config = {
        "path": {
            "identifier": "id",
            "pretrained": null,
            "label_file": "label.json"
        },
        "folder": {
            "dataset": "/home/senior/Lab/pysrc/data/dataset202312/data",
            "disassemble": "/home/senior/Lab/pysrc/othersData/Malware-detection-for-IoT-with-opcodes/Disassemble",
            "feature": "/home/senior/Lab/pysrc/othersData/Malware-detection-for-IoT-with-opcodes/Feature",
            "vectorize": "/home/senior/Lab/pysrc/othersData/Malware-detection-for-IoT-with-opcodes/Vectorize",
            "model": "/home/senior/Lab/pysrc/othersData/Malware-detection-for-IoT-with-opcodes/Model",
            "predict": "/home/senior/Lab/pysrc/othersData/Malware-detection-for-IoT-with-opcodes/Predict",
            "log": "/home/senior/Lab/pysrc/othersData/Malware-detection-for-IoT-with-opcodes/Log"
        },
        "model": {
            "model_name": "CNN",
            "batch_size": 4,
            "train_ratio": 0.8,
            "learning_rate": 0.0005,
            "epochs": 3,
            "shard": 8,
            "slice": 8,
            "hidden_dim": 100,
            "shard_count": 2,
            "slice_count": 2
        },
        "classify": false,
        "train": true,
        "predict": false,
        "unlearn": false
    }
    

    // merge 2 .json for input
    const userInput = JSON.stringify({
        config,
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
                console.error(`err from .py: ${data.toString()}`);
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
                message: 'Successfully found all documents',
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

module.exports = runPy;