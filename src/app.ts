import express,{NextFunction, Request,Response} from 'express';
import cors from "cors";
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';
import { json } from 'stream/consumers';
import { createBook } from './book/bookController';
import bookRouter from './book/bookRouter';
import { config } from './config/config';

const app =express();

app.use(cors({
    origin:config.frontendDomain,
}));
//Routes


//Http methods : Get , post
app.get('/', (req,res,next) =>{
   // throw new Error("something went wrong");
//    const error = createHttpError(400,"something went wrong");
//    throw error;
    res.json({message : "Welcome to my app"})
})
app.use(express.json())
app.use("/api/users",userRouter);//same as mounting
app.use("/api/books",bookRouter);


//Global error handler (after all routes)
app.use(globalErrorHandler);

export default app;