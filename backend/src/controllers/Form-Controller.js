//controller are here are 
// createForm
// storedataintoform

import asyncHandler from "../utils/Async-Handler.js";
import forms from "../models/form.model.js";
import {nanoid} from "nanoid"
import mongoose from "mongoose";


//create form controller

let CreateForm=asyncHandler(
    async function (req,res) {
        //we get user id in request always as we said it to during logined creation time
        //with the help of jwt once auth middleware get processed it will get it to us with the help of request inside
        //the below object is available inside in request object as we set in auth middleware phase after retriving it from request 
        let userIDinrequest=req.userPayloadData
        let mongooseFormUserId=new mongoose.Types.ObjectId(userIDinrequest)
        //extracting body data which comes in request
        let {formName}=req.body
        
        let randomFormId=nanoid(12)

        console.log(randomFormId)

        

        //assuming we already checked all things like validation before reaching request
        //here with the help of joi,zod,express validator

        //currently we doesn,t focused on limit things we just had use this for creating forms and no
        //other things we tackle down it ahead at a time or seperating its logic

        //let save the above things in database as we done with it
        //we already resolve promise as save gives save doc back after resolving promise
        let savedDocument=await forms.create({
              formname:formName,
              userId:mongooseFormUserId,
              formId:randomFormId
        })

        console.log(
            savedDocument
        )

        // assuming save document is truthy value show it get send it to frontend as a response 
        if(savedDocument)
        {
            res.status(201).json(
                {
                    "message":"form create succesfully",
                    "created form":{
                        formid:savedDocument.formId,
                        formName:savedDocument.formname
                    }
                }
            )

            return
        }

        res.status(503).json(
            {
                "status":"error",
                message:"Db Insertion failed"
            }
        )
    }
)


export {CreateForm}