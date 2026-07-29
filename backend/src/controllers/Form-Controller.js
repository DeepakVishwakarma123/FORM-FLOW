import asyncHandler from "../utils/Async-Handler.js";
import forms from "../models/form.model.js";
import {nanoid} from "nanoid"
import mongoose from "mongoose";
import formSubmissions from "../models/submission.model.js";


//create form controller
let CreateForm=asyncHandler(
    async function (req,res) {

        // user id will come inside request object
        // let userIDinrequest=req.userPayloadData
        
        //extracting body data which comes in request
        let {formName,userId}=req.body   
        let randomFormId=nanoid(12)
        console.log(randomFormId)

        let savedDocument=await forms.create({
              formname:formName,
              userId:userId,
              formId:randomFormId
        })

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



let RecordSubmission=asyncHandler(
    async function (req,res) {
        let {formId}=req.query
        
        //there are multiple fields can come in request body object 
        //show we want to let only specfic fields which follows our rule or system considerations

        let bodyObject=req.body
        
    }
)




export {CreateForm}