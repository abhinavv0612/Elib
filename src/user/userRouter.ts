import express from "express";

const userRouter = express.Router();

import createUser  from "./userController"

//routes
userRouter.post('/register',createUser);

export default userRouter;