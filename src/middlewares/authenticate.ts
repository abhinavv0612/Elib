import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return next(createHttpError(401, "Authorization token is required"));
    }
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, config.jwtSecret as string);

    console.log("decoded", decoded);
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
    next();
  } catch (err) {
    console.log(err);
    return next(createHttpError(401, "Invalid Token"));
  } //to call the next middleware
};
export default authenticate;
