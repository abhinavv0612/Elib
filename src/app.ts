import express,{NextFunction, Request,Response} from 'express';

import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';
import { json } from 'stream/consumers';
import { createBook } from './book/bookController';

const app =express();

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
app.use("/api/books",createBook);


//Global error handler (after all routes)
app.use(globalErrorHandler);



export default app;