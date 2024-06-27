import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("file", req.files);
  const { title, genre } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").pop();

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
    console.log("uploadResult", uploadResult);

    // console.log("userId",req.userId);
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
    res.status(201).json({ id: newBook._id });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while uploading the files"));
  }
};
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  //check access
  const _req = req as AuthRequest;
  if (book.author.toString() != _req.userId) {
    return next(createHttpError(403, "You cannot update others book"));
  }

  //check if image field is exists;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let completeCoverImage = "";

  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    //sending files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverMimeType,
    });
    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  //check if file field exists
  let completeFileName = "";
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      files.file[0].filename
    );
    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;
    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-pdfs",
    });
    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );
  res.json(updatedBook);
};
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.find();
    res.json(book);
  } catch (err) {
    return next(createHttpError(500, "Error while getting books"));
  }
};
const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.bookId;
  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book nnot found"));
    }
    return res.json(book);
  } catch (err) {
    return next(createHttpError(500, "Error while getting a book"));
  }
};
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book not found"));
  }
  const _req = req as AuthRequest;
  if (book.author.toString() != _req.userId) {
    return next(createHttpError(430, "You cannot delete others book"));
  }

  const coverFileSplit = book.coverImage.split("/");
  const coverImagePublicId =
    coverFileSplit.at(-2) + "/" + coverFileSplit.at(-1)?.split(".").at(-2);

  const bookFileSplit = book.file.split("/");
  const bookFilePublicId = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);

  await cloudinary.uploader.destroy(coverImagePublicId);
  await cloudinary.uploader.destroy(bookFilePublicId, {
    resource_type: "raw",
  });
  await bookModel.deleteOne({ _id: bookId });
  return res.status(204);
};
export { createBook, updateBook, listBooks, getSingleBook,deleteBook  };
