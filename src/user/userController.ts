import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
 const { name, email, password } = req.body;

 //Validation
 if (!name || !email || !password) {
  const error = createHttpError("400", "aLL fields are required");
  return next(error);
 }

 //database call
 const user =await userModel.findOne({email:email})
 if(user)
    {
        const error =createHttpError(400,"User already exsists with this email");
        return next(error);
    }

 //Process

 //Response
 res.json({
  message: "User created",
 });
};

export default createUser;
