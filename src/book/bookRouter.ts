import express from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";

const bookRouter = express.Router();

//store file locally --> upload on external storage then delete

const upload  = multer({
    dest : path.resolve(__dirname , '../../public/data/uploads'),
    limits : {fileSize : 3e7 }      //30mb
})


//routes
bookRouter.post("/",upload.fields([
    {name:'coverImage',maxCount :1},
    {name : "file", maxCount :1},
]), createBook);  //multer is a middleware for multipart data parsing
//  

export default bookRouter;
