const fs = require('fs');
const { spawn } = require('child_process');
const pyFileName = 'src/test.py';

const runPy = async (Model, req, res) => {
    const sort = parseInt(req.query.sort) || 'desc';
    //search the chosen data
    const label = await Model.find({ removed: false, "CPUArchitecture": "ARM"}).limit(10).sort({ created: sort }).populate().exec();
    
    //config.json
    config = {
            "path":{
                "label":"./Dataset/dataset202312/dataset.csv",
                "pretrained":null,
                "position":"./position.csv",
                "submodel_name":"./submodel_name.csv",
                "unlearn":"",

                "record": "./record.csv",
                "result": "./result.json"
            },
            "folder":{
                "dataset":"./Dataset/dataset202312/data",
                "vectorize":"./Vectorize/dataset202312_data",
                "model":"./Model/dataset202312_data/",
                "predict":"./Predict/dataset202312_data",
                
                "embedding": "./Embedding/",
                "unlearn": "./Unlearn/",
                "explain": "./Explain/"
            },
            "model":{
                "model_name":"VGG16",
                "batch_size":4,
                "train_ratio":0.8,
                "learning_rate":5e-4,
                "epochs":3,
                "shard":8,
                "slice":8,
                "print_information":"",

                "hidden_dim": 100,
                "shard_count": 2,
                "slice_count": 2
            },
            "classify":false
        }

    // merge 2 .json for input
    const userInput = JSON.stringify({
        config,
        label
    });


    if (userInput.length > 0) {
        new Promise((resolve, reject) => {
            const pythonProcess = spawn('python3', [pyFileName]);

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
                console.log(`child_process ends, code:${code}`);
                if (code !== 0) {
                    reject(new Error(`.py ends, code: ${code}`));
                    return;
                }
                resolve();
            });

            ////////////////////////
            /*
            // 将数据分块写入子进程
            const chunkSize = 100000; // 每个块的大小
            let currentIndex = 0;

            function writeChunk() {
                if (currentIndex < userInput.length) {
                    const chunk = userInput.slice(currentIndex, currentIndex + chunkSize);
                    currentIndex += chunkSize;
                    pythonProcess.stdin.write(chunk, writeChunk);
                } else {
                    pythonProcess.stdin.end();
                }
            }

            writeChunk();
            */
           ////////////////////////
           pythonProcess.stdin.write(userInput);
           pythonProcess.stdin.end();

        }).then(() => {
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