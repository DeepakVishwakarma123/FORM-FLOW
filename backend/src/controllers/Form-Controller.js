import asyncHandler from "../utils/Async-Handler.js";
import forms from "../models/form.model.js";
import mongoose from "mongoose";
import formSubmissions from "../models/submission.model.js";
import {aggregationPipelineFactory} from "../utils/AggretionPipeline.js";
import customValues from "../models/customValue.js";
import customFields from "../models/customFields.model.js";
import { filterArrayBased } from "../utils/constant.js";


//create form controller
let CreateForm=asyncHandler(
    async function (req,res) {

        // user id will come inside request object
        // let userIDinrequest=req.userPayloadData
        
        //extracting body data which comes in request
        let {formName,userId}=req.body   

        let savedDocument=await forms.create({
              formname:formName,
              userId:userId
        })

       

        // assuming save document is truthy value show it get send it to frontend as a response 
        if(savedDocument)
        {
            res.status(201).json(
                {
                    "message":"form create succesfully",
                    "created form":{
                        formid:savedDocument._id,
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

        let {formid}=req.params
        let userData=req.body
        let fieldKeysArray=Object.keys(userData)
        /*
        the following function returns an Array which contains 
        senderFieldKeysArray , and remaningKeysArray
        */ let ClassifiedFieldArrays=filterArrayBased(fieldKeysArray)
            
            let fieldWithSenderAttribute=ClassifiedFieldArrays[0]
            let remainingFieldKeysArray=ClassifiedFieldArrays[1]
            let submissionDoc=new formSubmissions()

         console.log("the field with sender attribute",fieldWithSenderAttribute);
            
        let documentTobePut={}
      
        fieldWithSenderAttribute.forEach(
            (keyName) => {
                let lastDashIndexPosition=keyName.lastIndexOf("-")
                //we have sender keys in this format like ff-sender-firstName
                //so we just want to fetch firstName as entry in our database
                let senderOriginalKeyName=keyName.slice(lastDashIndexPosition+1)
                documentTobePut[senderOriginalKeyName]=userData[keyName]
            }
        )
        //addig formid 
        submissionDoc.formid=new mongoose.Types.ObjectId(formid)
        submissionDoc.sender=documentTobePut
        let savedDoc=await submissionDoc.save()
        let submissionid=savedDoc._id

        
        for(let fieldName of remainingFieldKeysArray)
        {
            //let split the array by delimeter - 
            let splittingFieldNameArray=fieldName.split("-")


          /*verfiy fieldName exist with form id
          if yes then map old to new doc value
          otherwise create both docs in collections
          */ 
           // bug in the below function fix it soon to avoid measure issues
           let isCustomFieldExistDoc=await customFields.findOne(
                {
                    fieldName:fieldName,
                    blockType:splittingFieldNameArray[1],
                    formid:new mongoose.Types.ObjectId(formid)
                }
            )

            console.log("hello custom filedoc ki kya value hai",isCustomFieldExistDoc);
            
            if(isCustomFieldExistDoc)
            {
             let customValueDoc=await customValues.create(
                {
                    value:userData[fieldName],
                    customFieldId:isCustomFieldExistDoc["_id"],
                    subid:new mongoose.Types.ObjectId(submissionid)
                }
            )    
            }
            else{
            let customFieldDoc=await customFields.create(
                {
                    fieldName:splittingFieldNameArray[2],
                    blockType:splittingFieldNameArray[1],
                    formid:new mongoose.Types.ObjectId(formid)
                }
            )

            let customValueDoc=await customValues.create(
                {
                    value:userData[fieldName],
                    customFieldId:customFieldDoc["_id"],
                    subid:submissionid
                }
            )
            }
        }

    

        res.status(200).send("<h1> form submitted succefully </h1>")
        
        // aggregationPipelineFactory(submissionid)
        
    }
)   


export {CreateForm,RecordSubmission}