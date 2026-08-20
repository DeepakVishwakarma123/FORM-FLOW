import users from "../models/user-model.js";
import asyncHandler from "../utils/Async-Handler.js";

let signUp=asyncHandler(
    async function (req,res) {

        console.log("hello this is craxere");
        
        //extract data from body
        let {email,password}=req.body
        //searching user exist in db or not
        let userdoc=await users.findOne(
            {emailId:email}
        )

     console.log("user doc value is now the user is alrady there",userdoc);
     
        
        if(userdoc===null)
        {
            console.log("hello");
            
           let createdUserDoc=await users.create(
            {
                emailId:email,
                hashedPassword:password
            }
           )

           res.status(200).json(
            {
                "message":"user registered successfully",
                "userData":createdUserDoc
            }
           )
           return
        }
        res.status(404).json(
            {
                "message":"already registered happended"
            }
        )
    }
)

let signIn=asyncHandler(
    async function (req,res) { 
        let cookis=req.cookies
        console.log(cookis);
        
        let {email,password}=req.body
        //first let search weather user exist the user in system or not
        let userDoc=await users.findOne({
            emailId:email
        })

        if(userDoc===null)
        {
            res.status(404).json(
                {
                    "message":"email is not found"
                }
            )
            return
        }

        let isValidPassword=await userDoc.verifyPassword(password)
        if(isValidPassword)
        { 
        let Acc_Token=userDoc.generateAccessToken()
        let Refresh_Token=userDoc.generateRefreshToken()
        console.log("hey ther sir",Refresh_Token);
        
        res.cookie("access_token",Acc_Token,{secure:true})
        res.cookie("refresh_token",Refresh_Token,{secure:true})
        res.status(200).json(
            {
                "mesage":"logined successfully"
            }
        )
        return
        }

        res.status(401).json(
            {
                "message":"invalid credentials"
            }
        )
    }
)

export  {signUp,signIn}