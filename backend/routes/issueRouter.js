const express = require('express');
const issueRouter = express.Router();
const issueController = require('../controllers/issueController');

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.fetchIssueById);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.patch("/issue/:id/toggle-status", issueController.toggleIssueStatus);
module.exports = issueRouter;