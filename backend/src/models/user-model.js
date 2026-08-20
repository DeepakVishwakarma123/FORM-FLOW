import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jsonwebtoken  from "jsonwebtoken"


const userSchema=new Schema(
    {
        refreshToken:{
            type:String,
            default:null
        },
        forgotPasswordToken:{
            type:String,
            default:null
        },
        hashedPassword:{
            type:String,
            required:true
        },
        verficationToken:{
            type:String,
            default:null
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

//let add password hash hook in mongoose schema
userSchema.pre(
    'save',async function () {
        console.log("the this is something here bro code",this)
        let unhashedPassword=this.hashedPassword
        console.log(unhashedPassword);
        
        let hashedPassword=await bcrypt.hash(unhashedPassword,10)
        this.hashedPassword=hashedPassword
    }
)

userSchema.methods.verifyPassword=async function (enteredPassword) {
  let verificationResult=await bcrypt.compare(enteredPassword,this.hashedPassword)
  return verificationResult
}

userSchema.methods.generateAccessToken=function () {
    let userId=this._id
    let accessToken=jsonwebtoken.sign(
        {userId},
        process.env.acc_secret,
        {
            algorithm:"HS256",
            expiresIn:"2m"
        }
    )
    return accessToken
}

userSchema.methods.generateRefreshToken=function () {
    let userId=this._id
    let refreshToken=jsonwebtoken.sign(
        {"ekbewafahai":"ekbewafahai"},
        process.env.rcc_secret,
        {
            algorithm:"HS256",
            expiresIn:"2d"
        }
    )
    return refreshToken
}

const users=new mongoose.model("user",userSchema)

export default users

