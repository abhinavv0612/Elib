import express from "express";

const userRouter = express.Router();

import {createUser, loginUser} from "./userController";

//routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

export default userRouter;
