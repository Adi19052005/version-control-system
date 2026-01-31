const express = require('express');
const repoRouter = express.Router();
const repoController = require('../controllers/repoController');

repoRouter.post("/repo/create", repoController.createRepo);
repoRouter.get("/repo/all", repoController.getAllRepo);
repoRouter.get("/repo/:id", repoController.fetchRepoById);
repoRouter.get("/repo/name/:name", repoController.fetchRepoByName);
repoRouter.get("/repo/user/:userId", repoController.fetchRepoForUser);
repoRouter.put("/repo/update/:id", repoController.updateRepoById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepoById);
repoRouter.patch("/repo/:id/toggle-visibility", repoController.toggleRepoVisibility);

module.exports = repoRouter;