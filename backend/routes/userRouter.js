const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');


userRouter.get("/", userController.getAllUsers);
userRouter.post("/signup", userController.signUpUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/:id", userController.getUserProfile);
userRouter.put("/:id", userController.updateUserProfile);
userRouter.delete("/:id", userController.deleteUser);



module.exports = userRouter;