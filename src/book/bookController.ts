import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
const createBook = async (req: Request, res: Response) => {
  console.log("file", req.files);

  
  const files = req.files as{[fieldname:string]: Express.Multer.File[]};

  const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);

  const fileName = files.coverImage[0].filename;

  const filePath = path.resolve(__dirname,'../../public/data/uploads',fileName)
try{
  const uploadResult = await cloudinary.uploader.upload(filePath,{
    filename_override : fileName,
    folder : 'book-covers',
    format:  coverImageMimeType,
  })

  const bookFileName = files.file[0].filename;
  const bookFilePath = path.resolve(
    __dirname,'../../public/data/uploads',bookFileName
  )
  const bookFileUplaodResult = await cloudinary.uploader.upload(bookFilePath,{
    resource:'raw',
    filename_override : bookFileName,
    folder: 'book-pdfs',
    format : 'pdf',
  })
  console.log("bookfileuploadresult", bookFileUplaodResult);
  console.log(uploadResult);
  res.json({});
}
catch(err)
{
  console.log(err);
  return next(createHttpError(500,"Error while uploadint the files"))
}

};

export { createBook };
