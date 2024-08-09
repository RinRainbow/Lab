const fs = require('fs');
const { spawn } = require('child_process');
//const pyFileName = '/home/senior/pysrc/pycode/isLab/IMCFN/Code/main.py';
///const pyFileName = '/home/senior/pysrc/pycode/Malware-detection-for-IoT-with-opcodes/Code/main.py'; 
const pyFileName = '/home/senior/pysrc/pycode/MalwareExpertForBackend/src/main.py'; 
const configPath = '/home/senior/pysrc/dataToPython.json'
const datasetfolder = "/home/senior/pysrc/data/dataset202312/data";

const runPy = async (Model, req, res) => {
    const sort = parseInt(req.query.sort) || 'desc';
    //search the chosen data
    //const label = await Model.find({ removed: false, "CPUArchitecture": "ARM"}).limit(10).sort({ created: sort }).populate().exec();
    const label = req.body;

    //config.json
    config = {
        "path": {
            "word2id": "/home/senior/pysrc/othersData/MalwareExpertForBackend/SAFE_model/word2id.json",
            "SAFEtorch": "/home/senior/pysrc/othersData/MalwareExpertForBackend/SAFE_model/SAFEtorch.pt",
            "asm2vec_model": "/home/senior/pysrc/othersData/MalwareExpertForBackend/asm2vec.pt",
            "record": "/home/senior/pysrc/othersData/MalwareExpertForBackend/record.json",
            "result": "/home/senior/pysrc/othersData/MalwareExpertForBackend/predict_result.json",
            "score": "/home/senior/pysrc/othersData/MalwareExpertForBackend/score.json"
        },
        "folder": {
            "dataset": "/home/senior/pysrc/data/dataset202312/data",
            "vectorize": "/home/senior/pysrc/othersData/MalwareExpertForBackend/Vec/",
            "feature": "/home/senior/pysrc/othersData/MalwareExpertForBackend/Feature/",
            "model": "/home/senior/pysrc/othersData/MalwareExpertForBackend/Model/",
            "predict": "/home/senior/pysrc/othersData/MalwareExpertForBackend/Predict",
            "embedding": "/home/senior/pysrc/othersData/MalwareExpertForBackend/Embedding/",
            "unlearn": "/home/senior/pysrc/othersData/MalwareExpertForBackend/Unlearn",
            "explain": "/home/senior/pysrc/othersData/MalwareExpertForBackend/Explain/"
        },
        "model": {
            "epoch": 10,
            "learning_rate": 0.01,
            "batch_size": 32,
            "hidden_dim": 100,
            "shard_count": 2,
            "slice_count": 2,
            "dropout_value": 0.5,
            "output_dim": 2,
            "softmax_dim": 1
        },
        "preprocess_method": "asm2vec",
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

module.exports = runPy;