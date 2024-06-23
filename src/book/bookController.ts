import { Request, Response,NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs"

const createBook = async (req: Request, res: Response ,next : NextFunction) => {
  console.log("file", req.files);
  const { title, genre } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

  const fileName = files.coverImage[0].filename;

  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const bookFileUplaodResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    console.log("bookfileuploadresult", bookFileUplaodResult);
    console.log(uploadResult);
    res.json({});

    //creating book  database in mongo db
    const newBook = await bookModel.create({
      title,
      genre,
      author: "6676a8953af2766d4633a75c",
      coverImage: uploadResult.secure_url,
      file: bookFileUplaodResult.secure_url,
    });
     
    //Delete temp files
     await fs.promises.unlink(filePath);
     await fs.promises.unlink(bookFilePath);
     res.status(201).json({id:newBook._id});

  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while uploading the files"));
  }
  
};
export { createBook };





