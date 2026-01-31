const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/awsconfig");

async function pullRepo(){  
    const repoPath = path.resolve(process.cwd(), ".sigmagit");
    const commitsPath = path.join(repoPath, "commits");
    try {
        const listParams = {
            Bucket: S3_BUCKET,
            Prefix: 'commits/'
        };
        const listedObjects = await s3.listObjectsV2(listParams).promise();

        const commitDirs = new Set();   
        listedObjects.Contents.forEach(obj => {
            const parts = obj.Key.split('/');
            if (parts.length > 2) {
                commitDirs.add(parts[1]);
            }
        });

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            await fs.mkdir(commitPath, { recursive: true });
            const commitFiles = listedObjects.Contents.filter(obj => obj.Key.startsWith(`commits/${commitDir}/`));
            for (const fileObj of commitFiles) {
                const fileKey = fileObj.Key;
                const fileName = path.basename(fileKey);
                const filePath = path.join(commitPath, fileName);
                const getParams = {
                    Bucket: S3_BUCKET,
                    Key: fileKey
                };
                const fileData = await s3.getObject(getParams).promise();
                await fs.writeFile(filePath, fileData.Body);
            }
        }

        console.log("All commits pulled from S3.");
    } catch (err) {
        console.error("Error pulling from S3 : ", err);
    }
}



module.exports = { pullRepo };