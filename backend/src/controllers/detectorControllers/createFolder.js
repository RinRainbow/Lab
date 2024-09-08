const fs = require('fs');
const { spawn } = require('child_process');
const path = '/home/campbell/Lab/backend/path.json';

const folderFilter = (folder) => folder.includes('detector1');
const createFolders = async () => {
    try {
    // 讀取 JSON 檔案
    const data = await fs.readFile(path.join(__dirname, path), 'utf8');
    const jsonData = JSON.parse(data);

    // 替換 JSON 中的占位符
    const folders = jsonData.folders.map(folder => folder.replace('${name}', name));

    // 過濾需要創建的資料夾
    const selectedFolders = folders.filter(folderFilter);

    // 創建資料夾
    await Promise.all(
        selectedFolders.map(folder => fs.mkdir(folder, { recursive: true }))
      );
  
      console.log(`Directories for ${jsonData.project.name} created successfully!`);
      console.log('Processed folders:', folders);
    } catch (err) {
      console.error('Error:', err);
    }
};

module.exports = createfolder;