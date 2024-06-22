import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  //Validation
  if (!name || !email || !password) {
    const error = createHttpError("400", "aLL fields are required");
    return next(error);
  }

  //database call
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(400).json({
        message: "User already exist",
      });
    }
  } catch (err) {
    return next(createHttpError(500, "error while getting user"));
  }

  //hash password

  const hashedPassword = await bcrypt.hash(password, 10); //10--> number of salt rounds

  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating the user"));
  }

  //Token generation ( JWT TOKENS)
  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    //Process

    //Response
    res.status(201).json({
      accessToken: token,
    });
  } catch (err) {
    return next(createHttpError(500, "error while signing"));
  }
};

//login

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "all fields required"));
  }
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return next(createHttpError(404, "User not found"));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(createHttpError(401, "Username or password incorrect"));
  }

  //create new access token
  const token = sign({ sub: user._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });
  res.json({ accessToken: token });
};

export { createUser, loginUser };
