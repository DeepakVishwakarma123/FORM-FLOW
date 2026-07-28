import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
        },
        refreshToken:{
            type:String,
            required:true
        },
        forgotPasswordToken:{
            type:String
        },
        hashedPassword:{
            type:String,
            required:true
        },
        emailId:{
            type:String,
            required:true
        },
        isEmailVerfied:{
            type:Boolean,
            default:false,
        }
    }
)

const users=new mongoose.model("user",userSchema)

export default users

