const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitId) {
    const repoPath = path.resolve(process.cwd(), ".sigmagit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDir = path.join(commitsPath, commitId);
        const files = await fs.readdir(commitDir);
        const parentDir = path.resolve(repoPath, "..");

        for (const file of files) {
            const srcPath = path.join(commitDir, file);
            const destPath = path.join(parentDir, file);

            const stat = await fs.stat(srcPath);

            if (stat.isDirectory()) {
                await fs.mkdir(destPath, { recursive: true });
                const innerFiles = await fs.readdir(srcPath);

                for (const inner of innerFiles) {
                    await fs.copyFile(
                        path.join(srcPath, inner),
                        path.join(destPath, inner)
                    );
                }
            } 
            else {
                await fs.copyFile(srcPath, destPath);
            }
        }

        console.log(`Reverted to commit ${commitId}`);
    } catch (err) {
        console.error("Error reverting to commit: ", err.message);
    }
}

module.exports = { revertRepo };
