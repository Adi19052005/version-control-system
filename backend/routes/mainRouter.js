const express = require('express');
const mainRouter = express.Router();
const userRouter = require('./userRouter.js');
const repoRouter = require('./repoRouter.js');
const issueRouter = require('./issueRouter.js');

mainRouter.use(issueRouter);
mainRouter.use(userRouter);
mainRouter.use(repoRouter);

mainRouter.get('/', (req, res) => {
        res.send('Welcome to the Version Control System Backend!');
    });


module.exports = mainRouter;