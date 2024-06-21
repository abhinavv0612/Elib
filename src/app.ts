import express from 'express'

const app =express();

//Routes
//Http methods : Get , post
app.get('/', (req,res,next) =>{
    res.json({message : "Welcome to my app"})

})
export default app;