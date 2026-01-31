const fs = require('fs').promises;
const path = require('path');
const uuid = require('uuid');

async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), '.sigmagit');
    const stagingPath = path.resolve(repoPath, 'staging');
    const commitsPath = path.resolve(repoPath, 'commits');

    try {
        const files = await fs.readdir(stagingPath);
        if (files.length === 0) {
            console.log('No files to commit. Staging area is empty.');
            return;
        }
        const commitId = uuid.v4();
        const commitPath = path.join(commitsPath, commitId);
        await fs.mkdir(commitPath, { recursive: true });
        for (const file of files) {
            const srcPath = path.join(stagingPath, file);
            const destPath = path.join(commitPath, file);
            await fs.copyFile(srcPath, destPath);
            await fs.unlink(srcPath);
        }
        await fs.writeFile(path.join(commitPath, 'metadata.json'),
            JSON.stringify({ timestamp: new Date().toISOString(), message }));

        console.log(`Committed changes with ID: ${commitId}`);
    } catch (err) {
        console.error('Error committing changes:', err.message);
    }
}


module.exports = { commitRepo };