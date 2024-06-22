import mongoose, { mongo } from "mongoose";
import { User } from "./userTypes";
const userSchema = new mongoose.Schema<User>({    //<user> for typescript 
    name:{
       type:String,
       required : true,
    },
    email:{
        type:String,
        required:true,
        unique : true,
    },
    password: {
        type:String,
        required:true,
    }
},{timestamps :true});


export default mongoose.model<User>('User',userSchema);