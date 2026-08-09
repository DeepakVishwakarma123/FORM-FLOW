import asyncHandler from "../utils/Async-Handler.js";
import forms from "../models/form.model.js";
import {nanoid} from "nanoid"
import mongoose from "mongoose";
import formSubmissions from "../models/submission.model.js";
import blockTypes from "../models/blockType-model.js";
import { filterArrayBased, filterArrayOfObjectBased, iterateOverFieldsAndAddThemIntoDatabase } from "../utils/constant.js";
import values from "../models/value-model.js"
// import propertys from "../models/property-model.js";
import customs from "../models/custom-model.js";

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

        let savedDoc=await blockTypes.create(
            {
                blockname:"date"
            }
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



let RecordSubmission=asyncHandler(
    async function (req,res) {




        let {formid}=req.query

        //let first find out of form whether it exist in our database or not otherwise the entries are get wrong show
        //if not exist then we can,t allow user to be in our system to write a data to database
        let isFormExist=await forms.findOne({formId:formid})
        if(isFormExist===null)
        {
            res.status(404).send("<h1>FORM ID NOT FOUND INVALID FORMID PLEASE USE VALID FORM ID  TO SUBMIT FORM TO OUR SERVICE</h1>")
            return
        }

        let userData=req.body
        let fieldKeysArray=Object.keys(userData)

        //ab hum valid keys ko valid db main valid fields main insert karenge uske liye hum
        //sabse phele keys ka array lenge  jo specfic fiedl hai unhe unko appropritate field main daal denge bus itna hi hai 
        
        //yeh sirf sender wali keys pure array main se dega bus
        let fieldWithSenderAttribute=filterArrayBased("sender",fieldKeysArray)
        let fieldWithUrlAttribute=filterArrayBased("url",fieldKeysArray)
        let fieldWithDateAttribute=filterArrayBased("date",fieldKeysArray)
        let fieldWithCountryAttribute=filterArrayBased("country",fieldKeysArray)
        let fieldWithEmailAttribute=filterArrayBased("email",fieldKeysArray)
        let fieldWithNumberAttribute=filterArrayBased("number",fieldKeysArray)
        let fieldWithTextAttribute=filterArrayBased("text",fieldKeysArray)
        let fieldWithPhoneAttribute=filterArrayBased("phone",fieldKeysArray)
        let fieldWithRatingAttribute=filterArrayBased("rating",fieldKeysArray)


        /*
         aisa ho sakta hai ki form main fields hi naa ho specifc jiske liye tum alaga s pura code run kar rahe teh toh falut tum iterate karoge yes show hume na kcuh alaga kran achhaiye like na
         ki jyda flat code na run karek hum ek hi loop ke ander hi ise shi kar le toh kaise rahega
        abhi ke liye hum is ignore karke sub field ke liye array pe iterate karnge agar voh field nhi bhi raih toh bhi karana padega 
         jo ki problem hai is jagah pe toh hume kuch aur karke ise get karna padega i mean       */
        


        let submissionDoc=new formSubmissions()

        //abhi humne aise le liya hai karke per kaunsi field ko kis data ke ander db maind aale yeh hume pata nhi hai 
        //yaa koi fix order nhi ho sakta hai udhar toh jo valid fiedls hai unhe hume unke hissab se valid schema main sender doc ke keys main dalana hoga jasie jo name hai usme firstName wale field aaye karke
        
        /*hum assume karte hai ki hum sabse pehle yaha pe formsubmission karenge ek sender data ko leke 
            isse ek form submissin id create hogi and uske behalf pe hum bohot sare cheeze kar sakte hai
            like hum us submission id ko leke database main hum other fields save karen pe use karenge
            aisa mujhe lagata hai karke 
        */
        let documentTobePut={}
        fieldWithSenderAttribute.forEach(
            (keyName) => {
                //yeh code data ko full uske form main dalega like 
                //ff-url-siteName kuch is tarah se

                //dusra tariak hi hai usme hume speic name pe field dalan chhate hai per woh
                //hume bhoht cheks karne pdenge
                documentTobePut[keyName]=userData[keyName]
            }
        )
        //addig formid there
        submissionDoc.formid=formid
        submissionDoc.sender=documentTobePut
        let savedDoc=await submissionDoc.save()
        let submissionid=savedDoc._id


   //sabse pehel kya karte hai sare blockstype ko get karte hai database se 
   //then use specfic keys ke sath map kar dete hai
   let BlockTypesDoc=await blockTypes.find({}).select("-__v")
   console.log(BlockTypesDoc);



   //generating spefic object id with corresponding field names




    //  let's bring out specfic things from above and let do the same things
     if(fieldWithUrlAttribute.length>0)
     {
        let returendArrayWithObject=filterArrayOfObjectBased("url",BlockTypesDoc,"blockname")
        let urlBlockId=returendArrayWithObject._id
        iterateOverFieldsAndAddThemIntoDatabase(fieldWithUrlAttribute,userData,submissionid,urlBlockId)
      
     }
     if(fieldWithDateAttribute.length>0)
     {
        let returendArrayWithObject=filterArrayOfObjectBased("date",BlockTypesDoc,"blockname")
        let dateBlockId=returendArrayWithObject._id
        iterateOverFieldsAndAddThemIntoDatabase(fieldWithDateAttribute,userData,submissionid,dateBlockId)
     }
     if(fieldWithCountryAttribute.length>0)
     {
        let returendArrayWithObject=filterArrayOfObjectBased("country",BlockTypesDoc,"blockname")
        let countryBlockId=returendArrayWithObject._id
        iterateOverFieldsAndAddThemIntoDatabase(fieldWithCountryAttribute,userData,submissionid,countryBlockId)        
     }
     if(fieldWithEmailAttribute.length>0)
     {  
        let returendArrayWithObject=filterArrayOfObjectBased("email",BlockTypesDoc,"blockname")
        let emailBlockId=returendArrayWithObject._id
        iterateOverFieldsAndAddThemIntoDatabase(fieldWithEmailAttribute,userData,submissionid,emailBlockId)
     }
     if(fieldWithNumberAttribute.length>0)
     {
        let returendArrayWithObject=filterArrayOfObjectBased("number",BlockTypesDoc,"blockname")
        let numberBlockId=returendArrayWithObject._id
        iterateOverFieldsAndAddThemIntoDatabase(fieldWithNumberAttribute,userData,submissionid,numberBlockId)
     }
     if(fieldWithPhoneAttribute.length>0)
     {
        let returendArrayWithObject=filterArrayOfObjectBased("phone",BlockTypesDoc,"blockname")
        let phoneBlockId=returendArrayWithObject._id
        iterateOverFieldsAndAddThemIntoDatabase(fieldWithPhoneAttribute,userData,submissionid,phoneBlockId)
    }
    if(fieldWithRatingAttribute.length>0)
        {
            let returendArrayWithObject=filterArrayOfObjectBased("rating",BlockTypesDoc,"blockname")
            let ratingBlockId=returendArrayWithObject._id
            iterateOverFieldsAndAddThemIntoDatabase(fieldWithRatingAttribute,userData,submissionid,ratingBlockId)
     }
     if(fieldWithTextAttribute.length>0)
     {
        let returendArrayWithObject=filterArrayOfObjectBased("text",BlockTypesDoc,"blockname")
        let textBlockId=returendArrayWithObject._id
        iterateOverFieldsAndAddThemIntoDatabase(fieldWithTextAttribute,userData,submissionid,textBlockId)
     }

        console.log(userData)

        //firs of all let insert value to specfic key in db by filterting them

    

        res.status(200).send("<h1> form submitted succefully </h1>")
    }
)


export {CreateForm,RecordSubmission}