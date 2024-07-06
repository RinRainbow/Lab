const fs = require('fs');
const { spawn } = require('child_process');
const pyFileName = 'src/test.py';

const runPy = async (Model, req, res) => {
    const sort = parseInt(req.query.sort) || 'desc';
    //search the chosen data
    const label = await Model.find({ removed: false, chosen: true }).sort({ created: sort }).populate().exec();
    
    //config.json
    config = [
        { config1: "abc", num1: 1 },
        { config2: "def", num2: 2 },
        { config3: "ghi", num3: 3 }

    ]

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

            /////////////////////////
            // 分块写入数据到子进程
            const chunkSize = 100000;  // 每个块的大小，根据需要调整
            let i = 0;
            function writeChunk() {
                if (i < userInput.length) {
                    if (pythonProcess.stdin.write(userInput.slice(i, i + chunkSize))) {
                        i += chunkSize;
                        writeChunk();
                    } else {
                        pythonProcess.stdin.once('drain', writeChunk);
                    }
                } else {
                    pythonProcess.stdin.end();
                }
            }
            writeChunk();
            /////////////////////////

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