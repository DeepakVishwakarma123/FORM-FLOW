import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema=new Schema(
    {
        username:{
            type:String,
            require:true,
        },
        refreshToken:{
            type:String,
            require:true
        },
        forgotPasswordToken:{
            type:String
        },
        hashedPassword:{
            type:String,
            require:true
        },
        emailId:{
            type:String,
            require:true
        },
        isEmailVerfied:{
            type:Boolean,
            default:false,
        }
    }
)

const users=new mongoose.model("user",userSchema)

export default users