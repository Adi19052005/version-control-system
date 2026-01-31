const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

async function addFile(filepath){
    const repoPath = path.resolve(process.cwd(), '.sigmagit');
    const stagingPath = path.resolve(repoPath, 'staging');

    if (!fsSync.existsSync(repoPath)) {
        console.error('Repository not initialized. Please run "init" command first.');
        return;
    }

    try{
        await fs.mkdir(stagingPath, { recursive: true });

        const filename = path.basename(filepath);
        const srcPath = path.resolve(process.cwd(), filepath);

        await fs.copyFile(srcPath, path.join(stagingPath, filename));
        console.log(`Added file ${filename} to staging area.`);
    }catch(err){
        console.error('Error adding file:', err.message);
    }
}

module.exports = { addFile };
