const fs = require('fs').promises;
const path = require('path');

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), '.sigmagit');
    const commitsPath = path.resolve(repoPath, 'commits');

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });
        await fs.writeFile(path.join(repoPath, 'config.json'),
            JSON.stringify({ bucket: process.env.S3_BUCKET }));
            
        console.log('Initialized empty VCS repository in', repoPath);
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.error('Repository already exists in', repoPath);
        } else {
            console.error('Error initializing repository:', err);
        }
    }
}

module.exports = { initRepo };