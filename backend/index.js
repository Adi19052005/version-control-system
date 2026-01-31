const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const mainRouter = require('./routes/mainRouter.js');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { initRepo } = require('./controllers/init');
const { addFile } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pushRepo } = require('./controllers/push');
const { pullRepo } = require('./controllers/pull');
const { revertRepo } = require('./controllers/revert');
const { argv } = require('process');

yargs(hideBin(process.argv))
    .command('start', "Start the server", {}, startServer)
    .command('init', 'Initialise a new repo', {}, initRepo)
    .command('add <filepath>', 'Add a new file to repo', (yargs) => {
        yargs.positional('filepath', {
            describe: 'Name of the file to add',
            type: 'string',
            demandOption: true
        });
    },
        (argv) => {
            return addFile(argv.filepath);
        })
    .command('commit <message>', 'Commit changes to the repo', (yargs) => {
        yargs.positional('message', {
            describe: 'Commit message',
            type: 'string',
            demandOption: true
        });
    }, (argv) => {
        return commitRepo(argv.message);
    })
    .command('push', 'Push changes to remote repository', {}, pushRepo)
    .command('pull', 'Pull changes from remote repository', {}, pullRepo)
    .command('revert <commitId>', 'Revert to a previous commit', (yargs) => {
        yargs.positional('commitId', {
            describe: 'ID of the commit to revert to',
            type: 'string',
            demandOption: true
        });
    }, (argv) => {
        return revertRepo(argv.commitId);
    })
    .demandCommand(1, 'You need atleast one command')
    .help().argv;

async function startServer() {

    const app = express();
    const port = process.env.PORT || 3000;

    dotenv.config();
    app.use(cors({ origin: '*' }));
    app.use(bodyParser.json());

   mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


    app.use('/', mainRouter);

    const server = http.createServer(app);
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        socket.on('joinRoom', (userId) => {
            user = userId;
            console.log(`User with ID: ${userId} joined room.`);
            socket.join(userId);
        });
    });
    const db = mongoose.connection;
    db.once ('open',async () => {
        console.log('Setting up change streams...');
    });

    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
