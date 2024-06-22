import path from 'node:path';

import express from "express";
import { createBook } from "./bookController";
import multer from "multer";


const bookRouter = express.Router();

//store file locally --> upload on external storage then delete


const upload = multer({
  dest: path.join(__dirname, "Router"as string),
  limits: { fileSize: 3e7 }, //30mb
});

//routes
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
); //multer is a middleware for multipart data parsing
//

export default bookRouter;