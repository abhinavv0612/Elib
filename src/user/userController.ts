import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    const error = createHttpError("400", "aLL fields are required");
    return next(error);
  }

  //database call
  const user = await userModel.findOne({ email: email });
  if (user) {
    const error = createHttpError(400, "User already exsists with this email");
    return next(error);
  }
  //hash password
const hashedPassword = await bcrypt.hash(password,10);    //10--> number of salt rounds


  //Process

  //Response
  res.json({
    message: "User created",
  });
};

export default createUser;
