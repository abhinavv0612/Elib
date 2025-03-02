import path from "node:path";

import express from "express";
import { createBook,deleteBook,getSingleBook,listBooks,updateBook} from "./bookController";
import multer from "multer";
import authenticate from "../middlewares/authenticate";

const bookRouter = express.Router();

//store file locally --> upload on external storage then delete

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 }, //10mb --> free cloudinary limit of size of file
});

//routes
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 }, //we are uploading image and pdf of the book on cloudinary
    { name: "file", maxCount: 1 },
  ]),
  createBook
); //multer is a middleware for multipart data parsing
//
bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 }, //we are uploading image and pdf of the book on cloudinary
    { name: "file", maxCount: 1 },
  ]),
  updateBook
); //multer is a middleware for multipart data parsing
//
bookRouter.get("/",listBooks);
bookRouter.get("/:bookId",getSingleBook);
bookRouter.delete("/:bookId",authenticate,deleteBook);
export default bookRouter;
