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

        //the controller reac here only if validators are passed out otherwise not
        //so here we have valid values as object

        //hamare pass data kuch aisa hai 
        /*
        {
        ff-sender-firstName:"rahul riddhi",
        ff-url-kartik:"https://",
        ff-sender-dob:"2444"
        }
        */
        let userData=req.body
        let fieldKeysArray=Object.keys(userData)

        //ab hum valid keys ko valid db main valid fields main insert karenge uske liye hum
        //sabse phele keys ka array lenge  jo specfic fiedl hai unhe unko appropritate field main daal denge bus itna hi hai 
        
        //yeh sirf sender wali keys pure array main se dega bus
        let fieldWithSenderAttribute=fieldKeysArray.filter(
            (fieldKeyName) => {
                return fieldKeyName.includes('sender')
            }
        )
        
        let submissionDoc=new formSubmissions()

        //abhi humne aise le liya hai karke per kaunsi field ko kis data ke ander db maind aale yeh hume pata nhi hai 
        //yaa koi fix order nhi ho sakta hai udhar toh jo valid fiedls hai unhe hume unke hissab se valid schema main sender doc ke keys main dalana hoga jasie jo name hai usme firstName wale field aaye karke
        
        let documentTobePut={}
        fieldKeysArray.forEach(
            (keyName) => {
                //yeh code data ko full uske form main dalega like 
                //ff-url-siteName kuch is tarah se

                //dusra tariak hi hai usme hume speic name pe field dalan chhate hai per woh
                //hume bhoht cheks karne pdenge
                documentTobePut[keyName]=userData[keyName]
            }
        )
        submissionDoc.sender=documentTobePut

   let savedDoc=await submissionDoc.save()

        console.log(userData)

        //firs of all let insert value to specfic key in db by filterting them

        res.status(200).json(
            {
                "message":"everythign is okk here",
                "userdata":savedDoc
            }
        )
    }
)


export {CreateForm,RecordSubmission}