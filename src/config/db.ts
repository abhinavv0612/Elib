import { config } from "./config";
import mongoose from "mongoose";

const connectDB = async () =>{
    try{
    mongoose.connect(config.databaseURL as string)

    mongoose.connection.on('connected', ()=>{
        console.log("Connected to db Successfully");
    });
    // mongoose.connection.on('error',(err) =>{
    //     console.log("Error in connecting to db",err);
    // })
    }  
    catch(err){
        console.error("Failed to connect to db" , err);
        process.exit(1);
    } 
}
export default connectDB;